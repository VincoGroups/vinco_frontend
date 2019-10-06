import React, {useState , useEffect, useRef}from 'react';
import Authnav from '../Authnav';
import BoxFiler from './BoxFiler/BoxFiler';
import PostsShow from './Posts/Posts';
import Connections from './Connections/Connections';
import firebase from '../../../ServerSide/basefile';
import FilterUsers from '../../../ServerSide/Filters/FilterUsersAdd';
import Subgroup from './Subgroups/Subgrouphome';
import MainChatShow from './Mainchat/Mainchat';

const Group = (props) => {

 const [groupres, setGroupRes] = useState({
    groupres: []
 })
 const [boxfiler , setBoxFiler] = useState({
   boxfiler: false
 })
 const [wallpost , setWallPost] = useState({
   wallpost: true
})
const [groupconnectivity , setGroupConnectivity] = useState({
   groupconnectivity: false
})
const [subcomp , setSubComp] = useState({
   subcomp: false
})
const [mainchat , setMainchat] = useState({
   mainchat: false
})
const [groupdetails , setGroupDetails] = useState({
   groupdetails: false
})
const [leavegroupmodal , setLeaveGroupModal] = useState({
   leavegroupmodal: false
})
const [show , setShow] = useState({
   show: 'hide'
})
const [addusersmodal , setAddUsersModal] = useState({
   addusersmodal: false
})
const [subgroups , setSubGroups] = useState({
   subgroups: false
})
const [adminuser , setAdminUser] = useState({
   adminuser: false
})
const [adminportal , setAdminPortal] = useState({
    adminportal: false
})
      
    const componentMounted = useRef(null);

    useEffect(() => {
      componentMounted.current = true;
      if (componentMounted.current) {
        setTimeout(() => {
        const {groupapi} = props.match.params;
        fetch('/api/group/checkusergroup/' + groupapi + '/' + firebase.auth().currentUser.uid)
       .then((res) => {
         return res.json();
       }).then((bod) => {
         if (bod.userresponse === true) {
           fetch('/api/group/' + groupapi + '/' + firebase.auth().currentUser.uid)
           .then((res) => {
               return res.json();
           }).then((bod) => {
               setGroupRes({
                   groupres: bod
               })
           }).then(() => {
             if (groupres.groupres.grouptype === "ORGANIZATIONALGROUPS") {
               setSubGroups({
                 subgroups: true
               })
             } else {
               setSubGroups({
                 subgroups: false
               })
             }
           }).catch((error) => {
               console.log(error)
           })
         } else if (bod.userresponse === false) {
           props.history.push('/dash');
         }
        }).catch((error) => {
          console.log(error);
        })

        if (groupres.groupres.groupid !== undefined) {
          fetch('/api/group/checkuseradmin/'+ groupres.groupres.groupid + '/' + firebase.auth().currentUser.uid)
        .then((res) => {
          return res.json();
        }).then((bod) => {
          if (bod === true) {
            setAdminUser({
              adminuser: true
            })
          } else {
            setAdminUser({
              adminuser: false
            })
          }
        }).catch((error) => {
          console.log(error);
        })
        }

        }, 500);
      }  
      return () => {componentMounted.current = false}  
    }, [groupres.groupres.groupid,groupres.groupres.grouptype,props.history,props.match.params])

  const AdminPortal = ({adminportal}) => {
      const [adminportalusers , setAdminPortalUsers] = useState({
        adminportalusers: []
      })
      const [admintotalusers , setAdminTotalUsers] = useState({
        admintotalusers: []
      })
      const [showAdminOptions, setAdminOptions] = useState({
        adminoptions: true
      })
      const [showAdminTitle, setAdminTitles] = useState({
        admintitle: false
      })

      const subComponentMounted = useRef(null);

      useEffect(() => {
        subComponentMounted.current = true;
        if (subComponentMounted.current) {
          if (adminportal === true) {
            setTimeout(() => {
              fetch('/api/group/getportalusers/' + groupres.groupres.groupid)
              .then((res) => {
                return res.json();
              }).then((bod) => {
                setAdminPortalUsers({
                  adminportalusers: bod
                })
              }).catch((error) => {
                console.log(error);
              })
    
              fetch('/api/group/getusers/' + groupres.groupres.grouptype + '/' + groupres.groupres.groupid)
              .then((res) => {
                return res.json();
              }).then((body) => {
                setAdminTotalUsers({
                  admintotalusers: body
                })
              }).catch((error) => {
                console.log(error);
              })
              }, 500);
          }
        } 
        return () => {subComponentMounted.current = false}
       }, [adminportal])

       const OutputOptionsUser = ({adminoptions}) => {
         if (adminoptions === true) {
            if (adminportalusers.adminportalusers.length > 0) {
              return (
              <div>
                    {
                        adminportalusers.adminportalusers.map((item) => (
                          <div key={adminportalusers.adminportalusers.indexOf(item)}>
                            <div className="user-container">
                            <div className="row">
                              <div className="col-md-8">
                              <h4>{item.firstname}</h4>
                              </div>
                              <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-6">
                                  <button className="button-submit" onClick={() => {
                                    fetch('/api/group/makeadmin/' + groupres.groupres.groupid + '/' + item.useruid, {
                                      method: 'POST'
                                    })
                                    .then((body) => {
                                      console.log('user has been made admin')
                                      setAdminPortalUsers({
                                        adminportalusers: body
                                      })
                                    }).catch((error) => {
                                      console.log(error);
                                    })
                                  }}>MAKE ADMIN</button>
                                </div>
                                <div className="col-md-6">
                                  <button className="button-red" onClick={() => {
                                    fetch('/api/group/removeuser/' + groupres.groupres.groupid + '/' + item.useruid, {
                                      method: 'DELETE'
                                    }).then(() => {
                                      fetch('/api/group/getportalusers/' + groupres.groupres.groupid)
                                      .then((res) => {
                                        return res.json();
                                      }).then((bod) => {
                                        console.log(bod);
                                        setAdminPortalUsers({
                                          adminportalusers: bod
                                        })
                                      }).catch((error) => {
                                        console.log(error);
                                      })
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
          if (admintotalusers.admintotalusers.length > 0) {
            return (
              <div>
                {
                  admintotalusers.admintotalusers.map((item) => (
                    <div key={adminportalusers.adminportalusers.indexOf(item)}>
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
                              fetch('/api/group/giveusertitle/' + groupres.groupres.grouptype + '/' + groupres.groupres.groupid + '/' + item.useruid , {
                                method: 'POST',
                                body: e.target.value
                              }).then((res) => {
                                return res.json();
                              }).then((body) => {
                                setAdminTotalUsers({
                                  admintotalusers: body
                                })
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

   const Addusers = ({addusersmodal}) => {
      const data = {
        clientid: groupres.groupres.clientid,
        groupapi: groupres.groupres.groupapi,
        groupdescription: groupres.groupres.groupdescription,
        groupid: groupres.groupres.groupid,
        groupname: groupres.groupres.groupname
      }
      if (addusersmodal === true) {
        return (
          <div>
            <div className="modal-edu-white">
             <div className="container">
              <div className="modal-padding">
               <div className="modal-container">
                <span className="closebtndark" onClick={() => {
                  setAddUsersModal({
                    addusersmodal: false
                  })
                }}>&times;</span>
                <h3>{"Add users to " + groupres.groupres.groupname}</h3>
                <FilterUsers cardstyle="suggest-card" buttonstyle="button-submit" data={data} api={groupres.groupres.groupapi}/>
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

  const LeaveGroupModal = ({leavegroupmodal}) => {
      if (leavegroupmodal === true) {
        return (
          <div>
            <div className="modal-edu-red">
              <div className="container">
              <div className="modal-padding">
                <span className="closebtnwhite" onClick={() => {
                  setLeaveGroupModal({
                    leavegroupmodal: false
                  })
                }}>&times;</span>
                <div className="title-padding">
                  <h2>{"YOU ARE ABOUT TO LEAVE " + groupres.groupres.groupname}</h2>
                </div>
                <h5>Please be advised that you are about to leave this group, you are able to re-join by just requesting to be added but we want to make sure that this is what you want</h5>
              <div className="input-container-major">
              <div className="group">      
                     <input type="text" className="inputbar-white" onChange={(e) => {
                          if(e.target.value === firebase.auth().currentUser.email) {
                            setShow({
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
                  <div className={show.show}>
                  <button className="button-white-red" onClick={() => {
                    fetch('/api/group/leavegroup/' + groupres.groupres.groupapi + '/' + groupres.groupres.groupid + '/' + firebase.auth().currentUser.uid , {
                      method: 'DELETE',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }
                    }).then(() => {
                      props.history.push('/dash')
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

   const ShowAdminButton = ({admintrue}) => {
      if (admintrue === true) {
        return (
          <div>
            <div className="button-padding">
             <button className="button-submit-blue" onClick={() => {
                setAdminPortal({
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


   const GroupDetails = ({groupdetails}) => {
    const [usersdetails , setUsersDetails] = useState({
      usersdetails: []
   })
    const subComponentMounted = useRef(null);
    useEffect(() => {
      subComponentMounted.current = true
      if (subComponentMounted.current) {
        if (groupdetails === true) {
          fetch('/api/group/getusers/' + groupres.groupres.grouptype + '/' + groupres.groupres.groupid)
          .then((res) => {
            return res.json();
          }).then((bod) => {
            setUsersDetails({
              usersdetails: bod
            })
          }).catch((error) => {
            console.log(error);
          })
        }
      }
    }, [groupdetails])
      if (groupdetails === true) {
        return (
          <div>
            <div className="modal-edu">
              <div className="container">
               <div className="modal-padding">
                <div className="modal-header-blue">
                  <span className="closebtnwhite" onClick={() => {
                    setGroupDetails({
                      groupdetails: false
                    })
                  }}>&times;</span>
                  <h2>{groupres.groupres.groupname + ' Details'}</h2>
                </div>
                <div className="modal-container">
                  <div className="float-right">
                    <h6>{groupres.groupres.users.length + ' users'}</h6>
                    <div className="button-padding">
                    <button className="button-submit" onClick={() => {
                      setAddUsersModal({
                        addusersmodal: true
                      })
                    }}>ADD USERS</button>
                    </div>
                    <ShowAdminButton admintrue={adminuser.adminuser}/>
                  </div>
                  <h3>GROUP MEMBERS</h3>
                  <div className="row">
                    {
                      usersdetails.usersdetails.map(item => (
                        <div key={usersdetails.usersdetails.indexOf(item)}>
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
                      setLeaveGroupModal({
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

   const SubGroupNav = ({subgroups}) => {
      if (subgroups === true) {
        return (
          <div>
             <p className="main-group-nav" onClick={() => {
             setBoxFiler({
               boxfiler: false
             })
             setWallPost({
               wallpost: false
             })
             setGroupConnectivity({
               groupconnectivity: false
             })
             setSubComp({
               subcomp: true
             })
            }}>SUBGROUPS</p>
          </div>
        )
      } else {
        return null;
      }
    }

       return (
            <div>
             <Authnav/>
             <div className="page">
               <div className="group-navigation">
                 <h3>{groupres.groupres.groupname}</h3>
                 <div className="group-component-padding">
                 <div className="group-main-component">
                 <p className="main-group-nav" onClick={() => {
                        setBoxFiler({
                          boxfiler: false
                        })
                        setWallPost({
                          wallpost: true
                        })
                        setGroupConnectivity({
                          groupconnectivity: false
                        })
                        setSubComp({
                          subcomp: false
                        })
                    }}>POSTS</p>
                 </div>
                 <div className="group-main-component">
                 <p className="main-group-nav" onClick={() => {
                      setBoxFiler({
                        boxfiler: true
                      })
                      setWallPost({
                        wallpost: false
                      })
                      setGroupConnectivity({
                        groupconnectivity: false
                      })
                      setSubComp({
                        subcomp: false
                      })
                    }}>BOXFILER</p>
                 </div>
                 <div className="group-main-component">
                 <p className="main-group-nav" onClick={() => {
                      setBoxFiler({
                        boxfiler: false
                      })
                      setWallPost({
                        wallpost: false
                      })
                      setGroupConnectivity({
                        groupconnectivity: true
                      })
                      setSubComp({
                        subcomp: false
                      })
                    }}>CONNECTIONS</p>
                 </div>
                 <div className="group-main-component">
                   <p className="main-group-nav" onClick={() => {
                        setBoxFiler({
                          boxfiler: false
                        })
                        setWallPost({
                          wallpost: false
                        })
                        setGroupConnectivity({
                          groupconnectivity: false
                        })
                        setSubComp({
                          subcomp: false
                        })
                    }}>MAINCHAT</p>
                 </div>
                 <div className="group-main-component">
                 <SubGroupNav subgroups={subgroups.subgroups}/>
                 </div>
                 <div className="group-main-component">
                 <p className="main-group-nav" onClick={() => {
                      setGroupDetails({
                        groupdetails: true
                      })
                    }}>DETAILS</p>
                 </div>
                 </div>
              </div>
              <div className="grouppage">
                <BoxFiler 
                grouptype={groupres.groupres.typeofgroup} 
                groupapi={props.match.params.groupapi} 
                groupname={groupres.groupres.groupname}
                groupid={groupres.groupres.groupid} 
                boxfiler={boxfiler.boxfiler} 
                boxfilerid={groupres.groupres.boxfilerid} />
                <PostsShow 
                grouptype={groupres.groupres.typeofgroup} 
                groupapi={props.match.params.groupapi} 
                groupname={groupres.groupres.groupname} 
                groupid={groupres.groupres.groupid} 
                wallpostid={groupres.groupres.wallpostid} 
                mainchat={wallpost.wallpost} 
                mainchatname={groupres.groupres.groupname}
                usertitle={groupres.groupres.usertitle}
                />
                <Connections 
                grouptype={groupres.groupres.typeofgroup}
                groupapi={props.match.params.groupapi} 
                boxfilerid={groupres.groupres.boxfilerid} 
                groupid={groupres.groupres.groupid} 
                groupname={groupres.groupres.groupname} 
                groupconnectivity={groupconnectivity.groupconnectivity}
                groupclientid={groupres.groupres.clientid}
                />
                <Subgroup
                subgroupcomp={subcomp.subcomp}
                groupname={groupres.groupres.groupname}
                groupid={groupres.groupres.groupid}
                subgroupid = {groupres.groupres.subgroupsid}
                grouptype = {groupres.groupres.typeofgroup}
                groupapi={groupres.groupres.groupapi}
                mainboxfilerid={groupres.groupres.boxfilerid}
                />
                <MainChatShow
                mainchatshow={mainchat.mainchat}
                groupname={groupres.groupres.groupname}
                mainchatid={groupres.groupres.mainchatid}
                groupid={groupres.groupres.groupid}
                grouptype={groupres.groupres.typeofgroup}
                />
              </div>
             <GroupDetails groupdetails={groupdetails.groupdetails}/>
             <LeaveGroupModal leavegroupmodal={leavegroupmodal.leavegroupmodal}/>
             <Addusers addusersmodal={addusersmodal.addusersmodal}/>
             <AdminPortal adminportal={adminportal.adminportal}/>
            </div>
            </div>
        )
}

export default Group;