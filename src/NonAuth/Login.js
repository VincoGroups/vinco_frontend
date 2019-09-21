import React from 'react';
import Nav from './Comps/Nav';
import firebase from '../ServerSide/basefile';
import {Redirect} from 'react-router-dom';

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            loggedin: false
        }
    }

    componentDidMount() {
        this.setState({
            loggedin: false
        })
    }


    LoginFunction = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email , this.state.password)
        .then(() => {
         this.setState({
            loggedin: true
          })
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        const {loggedin} = this.state;
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
                        <input type="text" className="inputbar" name="email" onChange={(e) => {
                            this.setState({
                              [e.target.name]: e.target.value
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
                    <div className="longbutton text-center" onClick={this.LoginFunction}>LOGIN</div>
                  </div>
                </div>
                </div>
               </div>
              </div>
            </div>
        )
    }
}

export default Login;