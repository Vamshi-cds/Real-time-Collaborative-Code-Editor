import {Route, Routes} from 'react-router-dom';
import Login from './components/login';

import Editor from './components/editor';
import Page404 from './pages/404page';

// import Audio from './components/audio_eff/audio';
const Routers = (props:any) => (
    <Routes>
        <Route path="" element={<Login {...props}/>} />
        <Route path="editor" element={<Editor {...props} />} />

        
        <Route path='*' element={<Page404   /> } />
    </Routes>
)

export default Routers;

