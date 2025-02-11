import json
import uuid

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from apps.editor.util import apply_change

channel_to_username_map = {

}
groups_ids = {}
class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, *args, **kwargs):
        print(f'current sender {self.channel_name}')
        message = json.loads(kwargs['text_data'])
        if 'type' in message:
            if message['type'] == 'set_username':
                self.add_username(message['username'], message['curser'])
                return
            elif message['type'] == 'create_grp':
                self.create_grp()
                return
            elif message['type'] == 'join_grp':
                self.add_to_grp(message['grp_id'])
                return

        if 'grp_id' not in message:
            self.send(text_data=json.dumps({
                'type': 'doc_data',
                'status': 'error',
                'message': 'doc id is missing, either join grp or create new doc'
            }))

        print(f'current group {message["grp_id"]}')

        # transform_data, keeping it for new grp joiners.
        groups_ids[message['grp_id']]['data'] = apply_change(groups_ids[message['grp_id']]['data'], message['op'], message['range'], message['added_chars'])

        channel_to_username_map[str(self.channel_name)]['curser'] = message['curser']
        current_user = channel_to_username_map[str(self.channel_name)]
        other_users = self.get_user_in_channel(message['grp_id'])
        # other_users.remove(current_user)
        message['current_user'] = current_user
        message['sender_channel_id'] = self.channel_name
        message['other_users'] = other_users

        print(f'other users in my grp {other_users}')
        async_to_sync(self.channel_layer.group_send)(
        message["grp_id"],
        {
            'type': 'doc_data',
            'status': 'ok',
            'message': message
        }
    )


    def add_to_grp(self, grp_id):
        new_grp = grp_id not in self.channel_layer.groups
        if (grp_id not in self.channel_layer.groups) or self.channel_name not in self.channel_layer.groups[grp_id]:
            async_to_sync(self.channel_layer.group_add)(
                grp_id,
                self.channel_name
            )

        if not new_grp:
            self.send(
                text_data=json.dumps({
                    'type': 'join_grp',
                    'status': 'ok',
                    'data': groups_ids[grp_id]['data']
                }))

    # this method is needed for group messages sent and its name will be equal to type field of group msg
    # when send msg to group called this method is called for each channel present in grp.
    def doc_data(self, event):
        if self.channel_name == event['message']['sender_channel_id']:
            self.send(text_data=json.dumps(
                {'type': 'ack',
                 'version': 'change it !!'
            }
            ))
        else:
            self.send(
            text_data=json.dumps({
                'type': 'doc_data',
                **event['message']
            })
        )
    def create_grp(self):
        groups_id = str(uuid.uuid4())
        groups_ids[groups_id] = {
            'data':'',
            'rev':0,
        }
        self.add_to_grp(grp_id=groups_id)
        self.send(text_data=json.dumps({
            'type': 'create_grp',
            'status': 'ok',
            'grp_id': groups_id
        }))

    def add_username(self, username, curser):
        channel_to_username_map[str(self.channel_name)]= {'username': username,'curser': curser}
        self.send(text_data=json.dumps({
            'type': 'set_username',
            'status': 'ok'
        }))

    def get_user_in_channel(self, grp_name):
        res = []
        if grp_name in self.channel_layer.groups:
            for channel in self.channel_layer.groups[grp_name].keys():
                res.append(channel_to_username_map[str(channel)])
        return res

# todo: run thread to clean up user and grp map
# todo: code refactoring
# todo: use redis to store channels, instead of inmemory.
# todo: add transformation operations service to resolve conflicts.
# sample code for single char change events
        # Tii(Ins[p1, c1], Ins[p2, c2]) {
        #   if (p1 < p2) || ((p1 == p2) && (order() == -1))  // order() – order calculation
        # 	return Ins[p1, c1]; // Tii(Ins[3, ‘a’], Ins[4, ‘b’]) = Ins[3, ‘a’]
        #   else
        # 	return Ins[p1 + 1, c1]; // Tii(Ins[3, ‘a’], Ins[1, ‘b’]) = Ins[4, ‘a’]
        # }
        #
        # Tid(Ins[p1, c1], Del[p2]) {
        #   if (p1 <= p2)
        #     return Ins[p1, c1]; // Tid(Ins[3, ‘a’], Del[4]) = Ins[3, ‘a’]
        #   else
        #     return Ins[p1 – 1, c1]; // Tid(Ins[3, ‘a’], Del[1]) = Ins[2, ‘a’]
        # }
        #
        # Tdi(Del[p1], Ins[p2, c1]) {
        #   // Exercise
        # }
        #
        # Tdd(Del[p1], Del[p2]) {
        #   if (p1 < p2)
        #     return Del[p1]; // Tdd(Del[3], Del[4]) = Del[3]
        #   else
        #     if (p1 > p2) return Del[p1 – 1]; // Tdd(Del[3], Del[1]) = Del[2]
        #   else
        #     return Id; // Id – identity operator
        # }

## Joseph Gentle who is a former Google Wave engineer and an author of the Share.JS library wrote,
# “Unfortunately, implementing OT sucks. There’s a million algorithms with different tradeoffs,
# mostly trapped in academic papers. The algorithms are really hard and time consuming to implement correctly.
# […] Wave took 2 years to write and if we rewrote it today, it would take almost as long to write a second time.”
