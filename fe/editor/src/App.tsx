import React, { useEffect } from 'react';
import './App.css';
import  {BrowserRouter} from 'react-router-dom';
import Routers from './routes';

function App(props:any) {

  return (
    <BrowserRouter>
    <div className="App">
     
      <Routers {...props}/>
   
  </div>
  </BrowserRouter>
  );
}

// default props to pass to all childs
// App.defaultProps = {
//   testNumber:3
// }
export default App;
