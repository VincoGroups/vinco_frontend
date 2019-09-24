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
            loading: true,
            typeofgroup: 'BASICGROUPS'
        }
    }

    fetchUserGroups = () => {
       setTimeout(() => {
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
       }, 500);
    }

     componentDidMount() {
        this.setState({
            loading: true,
            currentuser: firebase.auth().currentUser.uid
        })
       this.fetchUserGroups();

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
        const ShowGroupTitleOnCreate = () => {
            if (this.state.groupname.length > 0) {
                return (
                    <div>
                     <h4>{"What kind of group is " + this.state.groupname + "?"}</h4>
                    </div>
                )
            } else {
                return (
                    <div>
                     <h4>What kind of group is this ?</h4>
                    </div>
                )
            }
        }
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
                          <ShowGroupTitleOnCreate/>
                          <div className="small-input-container">
                            <div className="select-group">
                            <select className="select-bar" name="typeofgroup" onChange={(e) => {
                                if(e.target.value === "Basic Group") {
                                    this.setState({
                                        [e.target.name] : "BASICGROUPS"
                                    })
                                } else if (e.target.value === "Organizational Group") {
                                    this.setState({
                                        [e.target.name] : "ORGANIZATIONALGROUPS"
                                    })
                                }
                            }}>
                             <option value="Basic Group">Basic Group</option>
                             <option value="Organizational Group">Organizational Group</option>
                            </select>
                            </div>
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
                            <button disabled={!this.state.groupname && !this.state.groupdescription} className="button-submit" onClick={(e) => {
                                const users = [];
                                users.push(this.state.currentuser);
                                const adminusers = [];
                                adminusers.push(this.state.currentuser);
                                let data;
                                if (this.state.typeofgroup === "BASICGROUPS") {
                                    data = {
                                        groupid: generateId(200),
                                        clientid: generateId(30),
                                        boxfilerid: generateId(150),
                                        wallpostid: generateId(151),
                                        groupname: this.state.groupname,
                                        groupdescription: this.state.groupdescription,
                                        usersadded: this.state.usersadded,
                                        creator: this.state.currentuser,
                                        groupapi: generateId(45) + "b",
                                        typeofgroup: this.state.typeofgroup,
                                        adminusers: adminusers,
                                        users: users
                                    }
                                } else if (this.state.typeofgroup === "ORGANIZATIONALGROUPS") {
                                    data = {
                                        groupid: generateId(200),
                                        clientid: generateId(30),
                                        boxfilerid: generateId(99),
                                        wallpostid: generateId(97),
                                        groupname: this.state.groupname,
                                        groupdescription: this.state.groupdescription,
                                        usersadded: this.state.usersadded,
                                        creator: this.state.currentuser,
                                        groupapi: generateId(45) + "o",
                                        subcomponentsid: generateId(47),
                                        typeofgroup: this.state.typeofgroup,
                                        adminusers: adminusers,
                                        users: users                                    
                                    }
                                }

                                console.log(data);

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
                            </button>
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
                        <div className={"groupcard-" + item.typeofgroup}>
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