import React from 'react';
import firebase from '../../ServerSide/basefile';
import {NavLink} from 'react-router-dom';
import axios from 'axios';
class Groupuser extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            res: [],
            modalshown: false
        }
    }

   async componentDidMount() {
       await axios.get('/api/group/getgroups/' + firebase.auth().currentUser.uid) 
       .then((bod) => {
           this.setState({
               res: bod.data
           })
       }).catch((error) => {
           console.log(error);
       })
   }

   ShowGroups = () => {
       return (
         <div>
          <div className="g-container">
            <div className="row">
                {
                    this.state.res.map(item => (
                        <div key={item.clientid}>
                        <div className="group-spacing">
                        <NavLink className="groupnav slightshadow" to={"/group/" + item.groupapi}>
                            <div className="groupcard-blue">
                                <h3 className="text-center">{item.groupname}</h3>
                            </div>
                        </NavLink>
                        </div>
                        </div>
                    ))
                }
            </div>
           </div>
         </div>
       )
   }

   ShowGroupsModal = ({modalshown}) => {
        if (modalshown === true) {
            return (
                <div>
                    <div className="modal-edu-white">
                     <div className="container">
                      <div className="modal-padding">
                      <span className="closebtndark" onClick={() => {
                          this.setState({
                              modalshown: false
                          })
                      }}>&times;</span>
                        <h1>{firebase.auth().currentUser.displayName + "'s Groups"}</h1>
                        <this.ShowGroups/>
                      </div>
                     </div>
                    </div>
                </div>
            )
        } else {
            return null;
        }
   }

    render() {
        console.log(this.state);
        return (
            <div>
             <h6 onClick={() => {
                 this.setState({
                     modalshown: true
                 })
             }}>GROUPS</h6>
             <this.ShowGroupsModal modalshown={this.state.modalshown}/>
            </div>
        )
    }
}

export default Groupuser;

