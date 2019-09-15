import React from 'react';
import {NavLink} from 'react-router-dom'

class Nav extends React.Component{
    render() {
        return (
            <div>
              <div className="NANav">
               <div className="container">
               <div className="row">
                <div className="col-md-9">
                 <h5>VINCO</h5>
                </div>
                <div className="col-md-3">
                 <div className="float-right">
                  <div className="row">
                  <div className="col-md-4">
                   <NavLink className="navlink" to ="/"><h6>HOME</h6></NavLink>
                  </div>
                  <div className="col-md-4">
                   <NavLink className="navlink" to ="/Register"><h6>REGISTER</h6></NavLink>
                  </div>
                  <div className="col-md-4">
                   <NavLink className="navlink" to ="/Login"><h6>LOGIN</h6></NavLink>
                  </div>
                  </div>
                 </div>
                </div>
               </div>
               </div>
              </div>
            </div>
        )
    }
}

export default Nav;