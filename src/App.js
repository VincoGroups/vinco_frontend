import React from 'react';
import './App.css';
import {BrowserRouter , Route} from 'react-router-dom';
import Home from './NonAuth/Home';
import Login from './NonAuth/Login';
import firebase from './ServerSide/basefile';
import PrivateRoute from './ServerSide/PrivateRoute';
import Dash from './Auth/Dash';
import Search from './Auth/Search';
import Register from './NonAuth/Register';
import Group from './Auth/Authcomps/Group/Group';
import Pendinggroups from './Auth/Pendinggroups';
class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      auth: false 
    }
  }

  _isMounted = false

  componentDidMount() {
    this._isMounted = true
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
       if(this._isMounted) {
        this.setState({
          auth: true
        })
       } else {
         this.setState({
           auth: false
         })
       }
      } else {
        this.setState({
          auth: false
        })
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }


  render() {
    return (
      <div>
        <BrowserRouter>
          <Route path="/" component={Home} exact/>
          <Route path="/Login" component={Login} exact/>
          <Route path="/Register" component={Register} exact/>
          <PrivateRoute path="/dash" component={Dash} isAuthenticated={this.state.auth} exact/>
          <PrivateRoute path="/search" component={Search} isAuthenticated={this.state.auth} exact/>
          <PrivateRoute path="/group/:groupapi" component={Group} isAuthenticated={this.state.auth} exact/>
          <PrivateRoute path="/pending" component={Pendinggroups} isAuthenticated={this.state.auth} exact/>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
