import React from 'react';
import Useraccount from './Useraccount';
import {NavLink} from 'react-router-dom';

class Authnav extends React.Component {
    render() {
        return (
            <div>
             <div className="AuthNav">
              <div className="container">
                <div className="row">
                 <div className="col-md-9">
                  <h5>VINCO</h5>
                 </div>
                 <div className="col-md-3">
                   <div className="row">
                   <div className="col-md-4">
                      <div className="nav-padding">
                      <NavLink to="/dash" className="navlink"><h6>HOME</h6></NavLink>
                      </div>
                    </div>
                    <div className="col-md-4">
                     <div className="nav-padding">
                      <NavLink to="/search" className="navlink"><h6>SEARCH</h6></NavLink>
                     </div>
                    </div>
                    <div className="col-md-4">
                       <Useraccount/>
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

export default Authnav;