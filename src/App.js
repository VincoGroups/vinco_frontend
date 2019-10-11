import React, {useState, useEffect, useRef} from 'react';
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
import SubHome from './Auth/Authcomps/Subgroup/SubHome';
import ConnectionPage from './Auth/Authcomps/Connections/Connectionpage';

const App = () => {
  const [auth, setAuth] = useState({
    auth: false
  })
  const componentDidMount = useRef(false);
  useEffect(() => {
    componentDidMount.current = true
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
       if(componentDidMount.current) {
        setAuth({
          auth: true
        })
       } else {
         setAuth({
           auth: false
         })
       }
      } else {
        setAuth({
          auth: false
        })
      }
    })
  }, [])

  return (
    <div>
      <BrowserRouter>
        <Route path="/" component={Home} exact/>
        <Route path="/Login" component={Login} exact/>
        <Route path="/Register" component={Register} exact/>
        <PrivateRoute path="/dash" component={Dash} isAuthenticated={auth.auth} exact/>
        <PrivateRoute path="/search" component={Search} isAuthenticated={auth.auth} exact/>
        <PrivateRoute path="/group/:groupapi" component={Group} isAuthenticated={auth.auth} exact/>
        <PrivateRoute path="/pending" component={Pendinggroups} isAuthenticated={auth.auth} exact/>
        <PrivateRoute path="/subgroup/:grouptype/:mainapi/:subapi" component={SubHome} isAuthenticated={auth.auth} exact/>
        <PrivateRoute path="/connection/:connectionapi" component={ConnectionPage} isAuthenticated={auth.auth} exact/>
      </BrowserRouter>
    </div>
  );
}

export default App;
