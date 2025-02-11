import { useRef, useState, useEffect } from 'react';
import "./style.css";

function Cursor(props: any) {
  const [top, setTop] = useState(props.top_position+'px');
  const [left, setLeft] = useState(props.left_position+'px');
  const [display, setDisplay] = useState(props.visibility);
  const [name, setName] = useState(props.username);


  // const cursor = useRef(null);
  // useEffect(()=>{

  //   setTop(props.top_position+'px');
  //   setLeft(props.left_position+'px');
  //   if (props.visibility){
  //   setDisplay('inline');}
  //   setName(props.usernname);

  // });
  return (
    
    <div className="cursor"  style={{top:top, left:left, display:display}} >
        {name}
    </div>
    
  )
}
export default Cursor;