import React, {useState , useEffect}from 'react';
import Authnav from '../Authnav';
import BoxFiler from './BoxFiler/BoxFiler';
import PostsShow from './Posts/Posts';
import Connections from './Connections/Connections';
import firebase from '../../../ServerSide/basefile';
import Addusersfilter from '../../../ServerSide/userfunctions/Addusers';
import Subgroup from './Subgroups/Subgrouphome';
import MainChatShow from './Mainchat/Mainchat';

class Group extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            groupres : [],
            boxfiler: false,
            wallpost: true,
            groupconnectivity: false,
            subcomp: false,
            mainchat: false,
            groupdetails: false,
            usersdetails: [],
            leavegroupmodal: false,
            show: 'hide',
            addusersmodal: false,
            subgroups: false,
            adminuser: false,
            adminportal: false,
       }
    }

   async componentDidMount() {
      const {groupapi} = this.props.match.params;
      await fetch('/api/group/checkusergroup/' + groupapi + '/' + firebase.auth().currentUser.uid)
      .then((res) => {
        return res.json();
      }).then((bod) => {
        if (bod.userresponse === true) {
          fetch('/api/group/' + groupapi + '/' + firebase.auth().currentUser.uid)
          .then((res) => {
              return res.json();
          }).then((bod) => {
              this.setState({
                  groupres: bod
              })
          }).then(() => {
            if (this.state.groupres.typeofgroup === "ORGANIZATIONALGROUPS") {
              this.setState({
                subgroups: true
              })
            } else {
              this.setState({
                subgroups: false
              })
            }
          }).catch((error) => {
              console.log(error)
          })
        } else if (bod.userresponse === false) {
          this.props.history.push('/dash');
        }
      }).catch((error) => {
        console.log(error);
      })

      setTimeout(() => {
      fetch('/api/group/checkuseradmin/'+ this.state.groupres.groupid + '/' + firebase.auth().currentUser.uid)
      .then((res) => {
        return res.json();
      }).then((bod) => {
        if (bod === true) {
          this.setState({
            adminuser: true
          })
        } else {
          this.setState({
            adminuser: false
          })
        }
      }).then(() => {
        fetch('/api/group/getusers/' + this.state.groupres.typeofgroup + '/' + this.state.groupres.groupid)
              .then((res) => {
                return res.json();
              }).then((bod) => {
                this.setState({
                  usersdetails: bod
                })
              }).catch((error) => {
                console.log(error);
              })
      }).catch((error) => {
        console.log(error);
      })
      }, 500);

    }

    AdminPortal = ({adminportal}) => {
      const [adminportalusers , setAdminUsers] = useState({
        allusers: []
      })
      const [adminusers , setTotalAdminUsers] = useState({
        totalusers: []
      })
      const [showAdminOptions, setAdminOptions] = useState({
        adminoptions: true
      })
      const [showAdminTitle, setAdminTitles] = useState({
        admintitle: false
      })


      const fetchPortalUsers = () => {
        setTimeout(() => {
          fetch('/api/group/getportalusers/' + this.state.groupres.groupid)
        .then((res) => {
          return res.json();
        }).then((bod) => {
          console.log(bod);
          setAdminUsers({
            allusers: bod
          })
        }).catch((error) => {
          console.log(error);
        })
        }, 500);
      }

      const fetchTotalUsers = () => {
        setTimeout(() => {
        fetch('/api/group/getusers/' + this.state.groupres.typeofgroup + '/' + this.state.groupres.groupid)
        .then((res) => {
          return res.json();
        }).then((body) => {
          console.log(body);
          setTotalAdminUsers({
            totalusers: body
          })
        }).catch((error) => {
          console.log(error);
        })
        }, 500);
      }
      
      useEffect(() => {
        fetchPortalUsers();
        fetchTotalUsers();
       }, [])

       const OutputOptionsUser = ({adminoptions}) => {
         if (adminoptions === true) {
            if (adminportalusers.allusers.length > 0) {
              return (
              <div>
                    {
                        adminportalusers.allusers.map((item) => (
                          <div key={adminportalusers.allusers.indexOf(item)}>
                            <div className="user-container">
                            <div className="row">
                              <div className="col-md-8">
                              <h4>{item.firstname}</h4>
                              </div>
                              <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-6">
                                  <button className="button-submit" onClick={() => {
                                    fetch('/api/group/makeadmin/' + this.state.groupres.groupid + '/' + item.useruid, {
                                      method: 'PUT'
                                    })
                                    .then(() => {
                                      console.log('user has been made admin')
                                      fetchPortalUsers();
                                    }).catch((error) => {
                                      console.log(error);
                                    })
                                  }}>MAKE ADMIN</button>
                                </div>
                                <div className="col-md-6">
                                  <button className="button-red" onClick={() => {
                                    fetch('/api/group/removeuser/' + this.state.groupres.groupid + '/' + item.useruid, {
                                      method: 'DELETE'
                                    }).then(() => {
                                      fetchPortalUsers();
                                    }).catch((error) => {
                                      console.log(error);
                                    })
                                  }}>REMOVE</button>
                                </div>
                              </div>
                              </div>
                            </div>
                            </div>
                          </div>
                        ))
                      }        
              </div>
              )
            } else {
              return (
              <div>
                  <h2 className="text-center">EVERYONE IS AN ADMIN</h2>
              </div>
              )
            }
         } else {
           return null;
         }
       }

       const OutputTitleUsers = ({outputtitle}) => {
        if (outputtitle === true) {
          if (adminusers.totalusers.length > 0) {
            return (
              <div>
                {
                  adminusers.totalusers.map((item) => (
                    <div key={adminusers.totalusers.indexOf(item)}>
                      <div className="user-container-blue">
                        <div className="row">
                         <div className="col-md-8">
                          <h6>{"TITLE: " + item.title}</h6>
                          <h4>{item.firstname + ' ' + item.lastname}</h4>
                         </div>
                         <div className="col-md-4">
                          <div className="input-container">
                           <input type="text" className="input-regular-white" placeholder="Give the user title" onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              fetch('/api/group/giveusertitle/' + this.state.groupres.typeofgroup + '/' + this.state.groupres.groupid + '/' + item.useruid , {
                                method: 'PUT',
                                body: e.target.value
                              }).then(() => {
                                fetchTotalUsers();
                              }).catch((error) => {
                                console.log(error);
                              })
                            }
                           }} />
                          </div>
                         </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          } else {
            return (
              <div>
                <h3 className="text-center">THERE ARE NO USERS</h3>
              </div>
            )
          }
        } else {
          return null;
        }
       }

      if (adminportal === true) {
        return (
          <div>
            <div className="modal-edu">
              <div className="container">
               <div className="modal-padding">
                <div className="modal-container">
                  <span className="closebtndark" onClick={() => {
                    this.setState({
                      adminportal: false
                    })
                  }}>&times;</span>
                  <h3>ADMIN PORTAL</h3>
                  <div className="row">
                    <div className="col-md-12">
                    <div className="float-left">
                      <div className="row">
                        <div className="col-md-6">
                        <div className="button-padding">
                        <button className="button-submit" onClick={() => {
                          setAdminOptions({
                            adminoptions: true
                          })
                          setAdminTitles({
                            admintitle: false
                          })
                        }}>OPTIONS</button>
                      </div>
                      </div>
                      <div className="col-md-6">
                      <div className="button-padding">
                        <button className="button-submit-blue" onClick={() => {
                          setAdminTitles({
                            admintitle: true
                          })
                          setAdminOptions({
                            adminoptions: false
                          })
                        }}>TITLES</button>
                      </div>
                      </div>
                      </div>
                   </div>
                    </div>
                  </div>
                  <div className="input-container">
                    <OutputOptionsUser adminoptions={showAdminOptions.adminoptions}/>
                    <OutputTitleUsers outputtitle={showAdminTitle.admintitle}/>
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

    Addusers = ({addusersmodal}) => {
      const data = {
        clientid: this.state.groupres.clientid,
        groupapi: this.state.groupres.groupapi,
        groupdescription: this.state.groupres.groupdescription,
        groupid: this.state.groupres.groupid,
        groupname: this.state.groupres.groupname
      }
      if (addusersmodal === true) {
        return (
          <div>
            <div className="modal-edu-white">
             <div className="container">
              <div className="modal-padding">
               <div className="modal-container">
                <span className="closebtndark" onClick={() => {
                  this.setState({
                    addusersmodal: false
                  })
                }}>&times;</span>
                <h3>{"Add users to " + this.state.groupres.groupname}</h3>
                <Addusersfilter cardstyle="suggest-card" buttonstyle="button-submit" data={data} api={this.state.groupres.groupapi}/>
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

    LeaveGroupModal = ({leavegroupmodal}) => {
      if (leavegroupmodal === true) {
        return (
          <div>
            <div className="modal-edu-red">
              <div className="container">
              <div className="modal-padding">
                <span className="closebtnwhite" onClick={() => {
                  this.setState({
                    leavegroupmodal: false
                  })
                }}>&times;</span>
                <div className="title-padding">
                  <h2>{"YOU ARE ABOUT TO LEAVE " + this.state.groupres.groupname}</h2>
                </div>
                <h5>Please be advised that you are about to leave this group, you are able to re-join by just requesting to be added but we want to make sure that this is what you want</h5>
              <div className="input-container-major">
              <div className="group">      
                     <input type="text" className="inputbar-white" onChange={(e) => {
                          if(e.target.value === firebase.auth().currentUser.email) {
                            this.setState({
                              show: 'show'
                            })
                          }
                    }} required />
                     <span className="highlight-white"></span>
                     <span className="bar-white"></span>
                    <label className="labelbar-white">PLEASE TYPE YOUR EMAIL TO CONFIRM</label>
                  </div>
              </div>
              <div className="input-container">
                <div className="float-right">
                  <div className={this.state.show}>
                  <button className="button-white-red" onClick={() => {
                    fetch('/api/group/leavegroup/' + this.state.groupres.groupapi + '/' + this.state.groupres.groupid + '/' + firebase.auth().currentUser.uid , {
                      method: 'DELETE',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }
                    }).then(() => {
                      console.log('this user was removed')
                    }).catch((error) => {
                      console.log(error);
                    })
                    
                  }}><h4>LEAVE</h4></button>
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

    ShowAdminButton = ({admintrue}) => {
      if (admintrue === true) {
        return (
          <div>
            <div className="button-padding">
             <button className="button-submit-blue" onClick={() => {
                this.setState({
                     adminportal: true
                  })
             }}>ADMIN PORTAL</button>
             </div>
          </div>
        )
      } else {
        return null;
      }
    }


    GroupDetails = ({groupdetails}) => {
      if (groupdetails === true) {
        return (
          <div>
            <div className="modal-edu">
              <div className="container">
               <div className="modal-padding">
                <div className="modal-header-blue">
                  <span className="closebtnwhite" onClick={() => {
                    this.setState({
                      groupdetails: false
                    })
                  }}>&times;</span>
                  <h2>{this.state.groupres.groupname + ' Details'}</h2>
                </div>
                <div className="modal-container">
                  <div className="float-right">
                    <h6>{this.state.groupres.users.length + ' users'}</h6>
                    <div className="button-padding">
                    <button className="button-submit" onClick={() => {
                      this.setState({
                        addusersmodal: true
                      })
                    }}>ADD USERS</button>
                    </div>
                    <this.ShowAdminButton admintrue={this.state.adminuser}/>
                  </div>
                  <h3>GROUP MEMBERS</h3>
                  <div className="row">
                    {
                      this.state.usersdetails.map(item => (
                        <div key={this.state.usersdetails.indexOf(item)}>
                          <div className="user-group-name-container">
                            <div className="user-group-name  d-inline-flex p-2">
                               <h6>{item.firstname + ' ' + item.lastname + ' / ' + item.title}</h6>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div className="button-padding">
                    <button className="button-red" onClick={() => {
                      this.setState({
                        leavegroupmodal: true
                      })
                    }}>LEAVE GROUP</button>
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

    SubGroupNav = ({subgroups}) => {
      if (subgroups === true) {
        return (
          <div>
             <h6 className="text-center" onClick={() => {
             this.setState({
              boxfiler: false,
              wallpost: false,
              groupconnectivity: false,
              subcomp: true,
              })
            }}>SUBGROUPS</h6>
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
             <Authnav/>
             <div className="page">
              <div className="group-navigation">
                <div className="row">
                 <div className="col-md-3">
                 <h3>{this.state.groupres.groupname}</h3>
                 </div>
                 <div className="col-md-9">
                  <div className="group-nav-padding">
                  <div className="row">
                  <div className="col-md-2">
                    <h6 className="text-center" onClick={() => {
                        this.setState({
                          boxfiler: false,
                          wallpost: true,
                          groupconnectivity: false,
                          subcomp: false,
                          mainchat: false
                        })
                    }}>POSTS</h6>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-center" onClick={() => {
                        this.setState({
                          boxfiler: true,
                          wallpost: false,
                          groupconnectivity: false,
                          subcomp: false,
                          mainchat: false

                        })
                    }}>BOXFILER</h6>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-center" onClick={() => {
                        this.setState({
                          boxfiler: false,
                          wallpost: false,
                          groupconnectivity: true,
                          subcomp: false,
                          mainchat: false

                        })
                    }}>CONNECTIONS</h6>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-center" onClick={() => {
                        this.setState({
                          boxfiler: false,
                          wallpost: false,
                          groupconnectivity: false,
                          subcomp: false,
                          mainchat: true
                        })
                    }}>MAINCHAT</h6>
                  </div>
                  <div className="col-md-2">
                    <this.SubGroupNav subgroups={this.state.subgroups}/>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-center" onClick={() => {
                      this.setState({
                        groupdetails: true
                      })
                    }}>DETAILS</h6>
                  </div>
                  </div>
                  </div> 
                 </div>
                </div>
              </div>
              <div className="grouppage">
                <BoxFiler 
                grouptype={this.state.groupres.typeofgroup} 
                groupapi={this.props.match.params.groupapi} 
                groupname={this.state.groupres.groupname}
                groupid={this.state.groupres.groupid} 
                boxfiler={this.state.boxfiler} 
                boxfilerid={this.state.groupres.boxfilerid} />
                <PostsShow 
                grouptype={this.state.groupres.typeofgroup} 
                groupapi={this.props.match.params.groupapi} 
                groupname={this.state.groupres.groupname} 
                groupid={this.state.groupres.groupid} 
                wallpostid={this.state.groupres.wallpostid} 
                mainchat={this.state.wallpost} 
                mainchatname={this.state.groupres.groupname}
                usertitle={this.state.groupres.usertitle}
                />
                <Connections 
                grouptype={this.state.groupres.typeofgroup}
                groupapi={this.props.match.params.groupapi} 
                boxfilerid={this.state.groupres.boxfilerid} 
                groupid={this.state.groupres.groupid} 
                groupname={this.state.groupres.groupname} 
                groupconnectivity={this.state.groupconnectivity}
                groupclientid={this.state.groupres.clientid}
                />
                <Subgroup
                subgroupcomp={this.state.subcomp}
                groupname={this.state.groupres.groupname}
                groupid={this.state.groupres.groupid}
                subgroupid = {this.state.groupres.subgroupsid}
                grouptype = {this.state.groupres.typeofgroup}
                groupapi={this.state.groupres.groupapi}
                mainboxfilerid={this.state.groupres.boxfilerid}
                />
                <MainChatShow
                mainchatshow={this.state.mainchat}
                groupname={this.state.groupres.groupname}
                mainchatid={this.state.groupres.mainchatid}
                groupid={this.state.groupres.groupid}
                grouptype={this.state.groupres.typeofgroup}
                />
              </div>
             </div>
             <this.GroupDetails groupdetails={this.state.groupdetails}/>
             <this.LeaveGroupModal leavegroupmodal={this.state.leavegroupmodal}/>
             <this.Addusers addusersmodal={this.state.addusersmodal}/>
             <this.AdminPortal adminportal={this.state.adminportal}/>
            </div>
        )
    }
}

export default Group;