import React from 'react';
import Authnav from './Authcomps/Authnav';
import {NavLink} from 'react-router-dom';
import firebase from '../ServerSide/basefile';
import generateId from '../ServerSide/generate';
import LoadingWhite from '../NonAuth/Comps/Loadingwhite';

class Dash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
            modalopened: false,
            groupname: '',
            groupdescription: '',
            usersadded: [],
            currentuser: '',
            suggestions: [],
            allusers: [],
            loading: true
        }
    }

    fetchUserGroups = () => {
        fetch('/api/group/getgroups/' + firebase.auth().currentUser.uid)
        .then((res) => {
            return res.json();
        }).then((body) => {
            this.setState({
                response: body,
                loading: false
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    async componentDidMount() {
        this.setState({
            loading: true,
            currentuser: firebase.auth().currentUser.uid
        })
        await this.fetchUserGroups();

      fetch('/user/getallusers')
        .then((res) => {
          return res.json();
        }).then((body) => {
          const newbody = body.filter(index => index.useruid !== this.state.currentuser)
          this.setState({
              allusers: newbody
          })
         }).catch((error) => {
          console.log(error)
        })
     }    

     renderSuggestions = () => {
        const {suggestions} = this.state
        if (suggestions.length === 0) {
            return null
        }
  
        return (
            <div>
              {suggestions.map(item => (
                  <div key={generateId(10)}>
                    <div className="suggest-card">
                      <div className="row">
                        <div className="col-md-10">
                          <h6>{item.email}</h6>
                          <h4>{item.firstname + ' ' + item.lastname}</h4>
                        </div>
                        <div className="col-md-2">
                         <div className="button-padding">
                          <button className="button-submit" onClick={() => {
                              this.state.usersadded.push(item.useruid)
                          }}>ADD USER</button>
                         </div>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )
    }

    ModalCreate = ({modalopened}) => {
        if (modalopened === true) {
            return (
                <div>
                  <div className="modal-edu">
                    <div className="container">
                     <div className="modal-padding">
                      <div className="modal-container">
                        <span className="closebtndark" onClick={() => {
                            this.setState({
                                modalopened: false
                            })
                        }} >&times;</span>
                        <h3 className="text-center">CREATE GROUP</h3>
                        <div className="input-container">
                            <div className="group">      
                                <input type="text" className="inputbar" name="groupname" onChange={(e) => {
                                    this.setState({
                                    [e.target.name]: e.target.value
                                    })
                                }} required />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className="labelbar">Name of Group</label>
                            </div>
                        </div>
                        <div className="input-container">
                            <div className="group">      
                                <textarea type="text" className="inputbar" name="groupdescription" onChange={(e) => {
                                    this.setState({
                                    [e.target.name]: e.target.value
                                    })
                                }} required />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className="labelbar">Group Description</label>
                            </div>
                        </div>
                        <div className="input-container">
                            <div className="group">      
                                <input type="text" className="inputbar" name="searchvalue" onChange={(e) => {
                                    let suggestions = [];
                                    if (e.target.value.length > 0) {
                                        const regex = new RegExp(`^${e.target.value}` , 'i');
                                        suggestions = this.state.allusers.sort().filter(v => regex.test(v.firstname))
                                    }
  
                                    this.setState({
                                        suggestions: suggestions
                                    })
                                }} required />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className="labelbar">People you want to add</label>
                            </div>
                            {this.renderSuggestions()}
                        </div>
                        <div className="input-container">
                            <div className="longbutton text-center" onClick={() => {
                                const users = [];
                                users.push(this.state.currentuser);
                                const data = {
                                    groupid: generateId(102),
                                    clientid: generateId(30),
                                    boxfilerid: generateId(99),
                                    wallpostid: generateId(97),
                                    groupname: this.state.groupname,
                                    groupdescription: this.state.groupdescription,
                                    usersadded: this.state.usersadded,
                                    creator: this.state.currentuser,
                                    groupapi: generateId(36),
                                    users: users
                                }
  
                
                                fetch('/api/group/creategroup' , {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(data)
                                }).then((res) => {
                                    return res.json();
                                }).then(() => {
                                    this.setState({
                                        modalopened: false
                                    })

                                    this.fetchUserGroups();
                                    
                                }).catch((error) => {
                                    console.log(error);
                                })                              
                              }}>
                                SUBMIT
                            </div>
                        </div>
                      </div>
                     </div>
                    </div>
                  </div>
                </div>
            )
        } else {
            return null;
        }
    }


     Groupoutput = () => {
         return (
            <div>
            <div className="g-container">
            <div className="row">
              {
                  this.state.response.map(item => (
                      <div key={item.clientid}>
                       <div className="group-spacing">
                       <NavLink className="groupnav slightshadow" to={"/group/" + item.groupapi}>
                        <div className="groupcard">
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

    render() {
        return (
            <div>
             <Authnav/>
             <div className="page">
               <div className="vinco-dash">
                <div className="container">
                <div className="row">
                 <div className="col-md-10">
                  <h1>HUB</h1>
                 </div>
                 <div className="col-md-2">
                 <div>
                    <button className="button-submit" onClick={() => {
                        this.setState({
                            modalopened: true
                        })
                    }}>CREATE GROUP</button>
                 </div>
                 </div>
                 <div>
                   <NavLink className="navlink" to="/pending">
                    <button className="button-submit-white">PENDING GROUPS</button> 
                   </NavLink>
                 </div>
                </div>
                <LoadingWhite loading={this.state.loading} />
                <this.Groupoutput/>
                </div>
               </div>
             </div>
             <this.ModalCreate modalopened={this.state.modalopened}/>
            </div>
        )
    }
}

export default Dash;