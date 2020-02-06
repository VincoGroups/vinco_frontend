import React, {useState} from 'react';
import Nav from './Comps/Nav';
import firebase from '../ServerSide/basefile';
import {Redirect} from 'react-router-dom';
import validator from 'email-validator';
import axios from 'axios'
const Register = () => {
    const [firstname, setFirstName] = useState({
        firstname: ''
    })
    const [lastname, setLastName] = useState({
        lastname: ''
    })
    const [email, setEmail] = useState({
        email: ''
    })
    const [password, setPassword] = useState({
        password: ''
    })
    const [loggedin, setLoggedIn] = useState({
        loggedin: false
    })

    const ShowValidEmailResponse = () => {
        if (validator.validate(email.email) === true && email.email.length > 0) { 
            return (
                <div>
                 <div className="title-padding">
                  <h6 className="color-green">VALID EMAIL</h6>
                 </div>
                </div>
            )
        } else if (validator.validate(email.email) === false && email.email.length > 0) { 
            return (
                <div>
                  <div className="title-padding">
                  <h6 className="color-red">NOT VALID EMAIL</h6>
                  </div>
                </div>
            )
        } else {
            return null;
        }
    }

    const RegisterUser = () => {
        const data = {
            firstname: firstname.firstname,
            lastname: lastname.lastname,
            email: email.email,
            password: password.password
        }
        axios.post('https://vincobackend.herokuapp.com/user/createuser', JSON.stringify(data), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((body) => {
            if(body.data === true) {
                firebase.auth().signInWithEmailAndPassword(email.email , password.password)
                .then(() => {
                    setLoggedIn({
                        loggedin: true
                    })
                }).catch((error) => {
                    console.log(error);
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }
        console.log(loggedin.loggedin)
        if (loggedin.loggedin) {
            return <Redirect to="/dash" />
        }
        return (
            <div>
            <Nav/>
             <div className="page">
              <div className="register-page">
               <div className="container">
                <h1>REGISTER</h1>
                <div className="row">
                 <div className="col-md-6">
                 <div className="input-container">
                     <div className="group">   
                        <input type="text" className="inputbar" name="firstname" onChange={(e) => {
                            setFirstName({
                              firstname: e.target.value
                            })
                        }} required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label className="labelbar">First Name</label>
                      </div>
                  </div>
                 </div>
                 <div className="col-md-6">
                 <div className="input-container">
                     <div className="group">      
                        <input type="text" className="inputbar" name="lastname" onChange={(e) => {
                            setLastName({
                              lastname: e.target.value
                            })
                        }} required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label className="labelbar">Last Name</label>
                      </div>
                  </div>
                 </div>
                </div>
                <div className="input-container">
                   <ShowValidEmailResponse/>
                     <div className="group">      
                        <input type="text" className="inputbar" name="email" onChange={(e) => {
                            setEmail({
                              email: e.target.value
                            })
                        }} required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label className="labelbar">Email</label>
                      </div>
                  </div>
                  <div className="input-container">
                     <div className="group">      
                        <input type="password" className="inputbar" name="password" onChange={(e) => {
                            setPassword({
                              password: e.target.value
                            })
                        }} required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label className="labelbar">Password</label>
                      </div>
                  </div>
                  <div className="input-container">
                    <div className="longbutton text-center" onClick={RegisterUser}>REGISTER</div>
                  </div>
               </div>
              </div>
             </div>
            </div>
        )
}

export default Register