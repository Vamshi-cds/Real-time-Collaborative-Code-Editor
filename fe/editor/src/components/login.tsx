import React, {SyntheticEvent, useEffect, useState} from "react";
import logo from '../logo.svg'
import  {isRouteErrorResponse, useNavigate} from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { setuser, setdocid } from "../actions/loginAction";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useLocation } from 'react-router-dom';
import './login.css';

const Login = (props:any) => {
  const nav = useNavigate();
  const loc = useLocation();

  // seeting username property for current comp
  const [username, setUsername] = useState('');
  const [docid, setDocId] = useState('');


  // getting fispatcher from redux
  const dispatch = useDispatch();
  const set_user = bindActionCreators(setuser, dispatch);
  const set_doc_id = bindActionCreators(setdocid, dispatch);


  // getting username from redux store
  const state_username = useSelector((state:any) => state.username);

  const submit = async (e: SyntheticEvent) => {
    // avoid resetting of feilds after submit
    e.preventDefault();
    try{
      // localStorage.setItem('Refresh_token', 'data from API')
      set_user(username);
      if (docid != null){
      
        set_doc_id(docid);
      }

      console.log(state_username)
      
      if (loc.search.includes("redirect")){
        // redirect back to original page
        nav(loc.search.split("redirect=")[1])
      }
      else{
        nav('editor');
      }
      
    }
    catch (error){
      // set login fail error msg
      console.log(error);
      // localStorage.removeItem('Refresh_token')
      set_user('');

    }
    
  }

 
  
    return (
<div className="form">
    <main >
      <form className="form" onSubmit={submit}>
      <div className="form">
    <div className="username">
      <input type="text" placeholder="USERNAME" onChange = {e => setUsername(e.target.value) }/>
    </div>

    <div className="doc">
    <input type="text" placeholder="SHARED DOCUMENT ID" onChange = {e => setDocId(e.target.value) }/>
    </div>
    <div className="login">
    <button className="login" type="submit"><span>Submit</span></button>
    </div>
    </div>
      </form>
    </main>
    </div> );};


export default Login;