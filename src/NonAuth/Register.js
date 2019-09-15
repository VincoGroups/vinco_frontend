import React from 'react';
import Nav from './Comps/Nav';
import firebase from '../ServerSide/basefile';
import {Redirect} from 'react-router-dom';
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            loggedin: false
        }
    }

    RegisterUser = () => {
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password
        }
        fetch('/user/createuser' , {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            return response.json();
        }).then((body) => {
            console.log(body);
            if(body === true) {
                firebase.auth().signInWithEmailAndPassword(data.email , data.password)
                .then(() => {
                    this.setState({
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

    render() {
        const {loggedin} = this.state
        if (loggedin) {
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
                            this.setState({
                              [e.target.name]: e.target.value
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
                            this.setState({
                              [e.target.name]: e.target.value
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
                     <div className="group">      
                        <input type="text" className="inputbar" name="email" onChange={(e) => {
                            this.setState({
                              [e.target.name]: e.target.value
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
                            this.setState({
                              [e.target.name]: e.target.value
                            })
                        }} required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label className="labelbar">Password</label>
                      </div>
                  </div>
                  <div className="input-container">
                    <div className="longbutton text-center" onClick={this.RegisterUser}>REGISTER</div>
                  </div>
               </div>
              </div>
             </div>
            </div>
        )
    }
}

export default Register