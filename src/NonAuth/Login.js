import React, {useState} from 'react';
import Nav from './Comps/Nav';
import firebase from '../ServerSide/basefile';
import {Redirect} from 'react-router-dom';
import {SecurityConfig , DecodeConfig} from '../Security/Encryption';

const Login = () => {
    const [email, setEmail] = useState({
        email: ''
    })
    const [password, setPassword] = useState({
        password: ''
    })
    const [loggedinvariable, setLogin] = useState({
        loggedin: false
    })
    
   const loginFunction = (e) => {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(DecodeConfig(email.email) , DecodeConfig(password.password))
        .then(() => {
         setLogin({
            loggedin: true
          })
        }).catch((error) => {
            console.log(error)
        })
    }

    const {loggedin} = loggedinvariable;
        if (loggedin) {
            return <Redirect to="/dash" />
        }

    return (
        <div>
         <Nav/>
          <div className="page">
           <div className="login-page">
            <div className="login-container">
            <div className="container">
             <h1 className="text-center">LOGIN</h1>
             <div className="input-container">
                 <div className="group">      
                    <input type="text" className="inputbar" onChange={(e) => {
                        setEmail({
                          email: SecurityConfig(e.target.value)
                        })
                    }} required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className="labelbar">Name</label>
                  </div>
              </div>
              <div className="input-container">
                 <div className="group">      
                    <input type="password" className="inputbar" name="password" onChange={(e) => {
                        setPassword({
                          password: SecurityConfig(e.target.value)
                        })
                    }} required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className="labelbar">Password</label>
                  </div>
              </div>
              <div className="input-container">
                <div className="longbutton text-center" onClick={loginFunction}>LOGIN</div>
              </div>
            </div>
            </div>
           </div>
          </div>
        </div>
    )
}

export default Login;