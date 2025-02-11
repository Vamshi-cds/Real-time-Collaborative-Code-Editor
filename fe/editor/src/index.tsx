import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import  rootReducer from './reducers/reducer';
import { configureStore } from '@reduxjs/toolkit'

const initialState = {
  username: '',
  doctitle: 'Untitled',
  docid: '',
  // pending_changes: {},
  // sent_changes:{},

};

const store =  configureStore({
  reducer:  rootReducer,
  preloadedState: initialState
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>  
    <App />
    </Provider>
    
  </React.StrictMode>
);

reportWebVitals(console.log);

