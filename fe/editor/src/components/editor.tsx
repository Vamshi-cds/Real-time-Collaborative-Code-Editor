import {  useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import  { useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import  { ReactCodeMirrorProps, EditorState, BasicSetupOptions } from '@uiw/react-codemirror';
import { python }  from '@codemirror/lang-python';
import './editor.css'
import * as cmState from "@codemirror/state";
import {LanguageSupport } from '@codemirror/language';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Cursor from './cursor';
import {  useDispatch } from "react-redux";
import { setdocid, setdoctitle } from "../actions/loginAction";
import { bindActionCreators } from "@reduxjs/toolkit";
import {EditorView, keymap} from "@codemirror/view"
import {generate_change_set, apply_change} from "../utils/change_set_generator";
function randomNumber(min:number, max:number) {
    return Math.random() * (max - min) + min;
}

const colors = [
    "#CC444B",
    "#32292F",
    "#8A4FFF",
    "#0B2027",
    "#F21B3F",
    "#FF9914",
    "#1F2041",
    "#4B3F72",
    "#FFC857",
  ];


const Editor = (props:any) =>{
const state_username = useSelector((state:any) => state.username);
const nav = useNavigate();
const loc = useLocation();



const basic_options :BasicSetupOptions = {
    lineNumbers: true,
    bracketMatching: true,
    autocompletion:true,
    syntaxHighlighting:true,
    

}
const options: ReactCodeMirrorProps|EditorState = {
    theme: "dark",
    editable: true,
    width:'100%',
    height:'100%',
    tabSize: 4,
    indentWithTab:false,
    basicSetup: basic_options
    
}
 // getting username from redux store
const docId = useSelector((state:any) => state.docid);
const docTitle = useSelector((state:any) => state.doctitle);
const [value, setValue] = useState("");
const ref = useRef<ReactCodeMirrorRef>({});
const [active_users, setUsers] = useState<JSX.Element[]>([]);
const dispatch = useDispatch();
const set_doc_id = bindActionCreators(setdocid, dispatch);
const set_doc_title = bindActionCreators(setdoctitle, dispatch);
const [extensions, setExtensions] = useState <(cmState.Extension | LanguageSupport)[]>([python()]);
const [socketUrl, setSocketUrl] = useState('ws://localhost:8000/ws/socket-server/');



const { sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket, } = useWebSocket(socketUrl);

const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    };

useEffect(()=>{
    if (state_username == ''){
        var redirect_url = '/?redirect=' +loc.pathname+loc.search;
        nav(redirect_url);
    }
    
    
    setExtensions([python()]);
    
    }, []);
const handle_title = async (e: string) => {
    console.log(e);
    // need to send it to server 
    set_doc_title(e);
}
const  handle_share_btn = () => {
    navigator.clipboard.writeText(docId);
    alert("Copied the Doc ID to clip board");

}
const onChange = (editor:string, viewUpdate:any) => {
    // console.log(editor.length);
    // console.log(viewUpdate.changedRanges[0]);
    // console.log(viewUpdate.startState.selection.ranges);
    // console.log(viewUpdate.changes.inserted);
    const {op, start_pt, end_point, added_chars} = generate_change_set(viewUpdate.changes.inserted,viewUpdate.changedRanges[0] );
    // replace content
    // viewUpdate.view.setState(EditorState.create({doc: 'my new content'}))

    // set curser poition
    // viewUpdate.view.dispatch({
    //     selection: {
    //       anchor: 1,
    //       head: 1,
    //     },
    //   });
    
    // get coords
    // console.log(viewUpdate.view.coordsAtPos(1) );
    
    // get current curer pos
    // console.log(viewUpdate.view.state.selection.main.head);
    // console.log(viewUpdate);
    
    const message = {
        'type': 'doc_data',
        'data': editor,
        'op': op,
        'range': [start_pt, end_point],
        'added_chars': added_chars,
        'curser': viewUpdate.view.state.selection.main.head
    }
    if (docId) {
        message['grp_id' as keyof typeof message] = docId
    }
    sendJsonMessage(message);
    setValue(editor);
    
}

useEffect(()=>{
    console.log(lastJsonMessage)

    if (lastJsonMessage) {
        if (lastJsonMessage['type' as keyof typeof lastJsonMessage] == 'create_grp' ){
            if ( lastJsonMessage.hasOwnProperty('grp_id')){
            set_doc_id(lastJsonMessage['grp_id' as keyof typeof lastJsonMessage])}
             
            
        }
        else if (lastJsonMessage['type' as keyof typeof lastJsonMessage] == 'join_grp'){
            
            setValue(lastJsonMessage['data' as keyof typeof lastJsonMessage])
            
            }
        else if (lastJsonMessage['type' as keyof typeof lastJsonMessage] == 'doc_data'){
            const users_list:Array<any> = lastJsonMessage['other_users' as keyof typeof lastJsonMessage];
            var cursers = [];
            for (let i = 0; i< users_list.length; i++){

                if (ref.current && ref.current.view){
                const curser_coords  =ref.current.view.coordsAtPos(users_list[i]['curser'])
                var doc_coords:any = {
                    'x' : 0,
                    'y': 0
                }
                if (document ){
                    doc_coords = document.getElementById('code')?.getBoundingClientRect()}
                console.log(state_username!= users_list[i]['username'])
                if (curser_coords && state_username!=users_list[i]['username']){
                cursers.push(<Cursor key={String(Date.now())+i} username={users_list[i]['username']} 
                    top_position={curser_coords['top']- doc_coords['y']} 
                    left_position={curser_coords['left']- doc_coords['x']}
                      visibility='inline' />)
                    }
                }
            }
            
            setValue(apply_change(value, lastJsonMessage['op' as keyof typeof lastJsonMessage], lastJsonMessage['range' as keyof typeof lastJsonMessage], lastJsonMessage['added_chars' as keyof typeof lastJsonMessage]));
            setUsers(cursers);
            console.log(active_users);
        }
    }


}, [lastJsonMessage])

useEffect(()=>{
        
    console.log(connectionStatus[readyState]);
    // connection transitioned to opened state, then set current user username
    if (connectionStatus[readyState] == connectionStatus[1]) {

        

        sendJsonMessage({ type: 'set_username', username: state_username, curser:0 })

        if (! docId ) {
            console.log('create req')
            sendJsonMessage({ type: 'create_grp' })
            
        }
        else
        {   console.log('joined req')
            sendJsonMessage({ type: 'join_grp',
            grp_id: docId })
        }

    }



}, [readyState])





return (
        <div className="code-container">

       <button className="sharebtn" onClick={handle_share_btn}>Copy Doc ID</button>
        <div className="glow-container">
          <div className="augs" data-augmented-ui></div>
        </div>
        <section className="augs bg" data-augmented-ui>
          <input className="title" placeholder="untitled" onBlur={e =>handle_title(e.target.value)}/>

          <div className="code highcontrast-dark">
            {active_users}
            <CodeMirror value = { value} 
             {...options} 
             onChange={onChange}
             extensions={extensions}
             id="code"
             ref={ref} />        
          </div>
        </section>
      </div>
    
    
    

    
    );

};



export default Editor;
