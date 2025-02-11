const new_chars = [
    {text:[
        ""
    ]},
    {text:[
        "",
        ""
    ]}
]
  const pos =  {
    "fromA": 3,
    "toA": 4,
    "fromB": 3,
    "toB": 4
}
    function generate_change_set( new_chars:any, pos:any ){
    var added_chars = ''
    for (const v of new_chars){
        if (v.hasOwnProperty('text')){
            if (v['text'].length == 2 && v['text'][0]=='' && v['text'][1]=='')
              { added_chars+='\n'
                continue
                 }
            if (v['text'].length == 1 && v['text'][0]==''){
                continue
            }
            for (const g of v['text']){
                    if (g ==''){
                        added_chars+='\n'
                    }
            else{added_chars+= g}
            }
            }
    }
    console.log(added_chars);
    
    var op = '';
    var start_pt = 0;
    var end_point = 0;
    if (pos['fromA'] == pos['toA']){
        op='Addition'
        start_pt = pos['toA'];
        end_point = pos['toA'];
    }
    else if (pos['fromB'] == pos['toB']){
        op='Deletion'
        start_pt = pos['fromA'];
        end_point = pos['toA']-1;
    }
    else{
        op='Replace';
        start_pt = pos['fromA'];
        end_point = pos['toA']-1;
    }
    return {op, start_pt, end_point, added_chars};
    
}
// console.log(generate_change_set(new_chars, pos));

export  {generate_change_set};

function apply_change(data:string, op:string,change_range:Array<number>, new_chars:string ){
    
    if (op == 'Addition'){
        data = data.slice(0,change_range[0]) + new_chars +data.slice(change_range[0],)
    }
    else if (op == 'Deletion'){
        data = data.slice(0,change_range[0]) + data.slice(change_range[1]+1,)}
    else {
        data = data.slice(0,change_range[0]) +new_chars + data.slice(change_range[1]+1,)}

return data}

export {apply_change};