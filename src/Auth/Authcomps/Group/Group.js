import React, {useState , useEffect, useRef, useCallback}from 'react';
import Authnav from '../Authnav';
import BoxFiler from './BoxFiler/BoxFiler';
import ConnectionsHome from './Connections/Connectionhome';
import firebase from '../../../ServerSide/basefile';
import FilterUsers from '../../../ServerSide/Filters/FilterUsersAdd';
import Subgroup from './Subgroups/Subgrouphome';
import Posts from './Posts/Posts';
//import MainChatShow from './Mainchat/Mainchat';

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
const [userdetails , setUsersDetails] = useState({
  userdetails: []
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
      
    const componentMounted = useRef(null);
    useEffect(() => {
      componentMounted.current = true;
      const {groupapi} = props.match.params;
        setTimeout(() => {
        if (componentMounted.current) {
          fetch('/api/group/checkusergroup/' + groupapi + '/' + firebase.auth().currentUser.uid)
         .then((res) => {
           return res.json();
         }).then((bod) => {
           if (bod.userresponse === true) {
             fetch('/api/group/getgroupdetails/' + groupapi + '/' + firebase.auth().currentUser.uid)
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
  

          fetch('/api/group/getusers/' + groupres.groupres.grouptype + '/' + groupres.groupres.groupid)
          .then((res) => {
            return res.json();
          }).then((bod) => {
            setUsersDetails({
              userdetails: bod
            })
          }).catch((error) => {
            console.log(error);
          })
          }
        }, 500);
      return () => {componentMounted.current = false}  
    }, [groupres.groupres.groupid ,groupres.groupres.grouptype ,props.history , props.match.params])


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

    const AdminPortal = ({adminportal}) => {
      const [showAdminPage , setAdminPage] = useState({
        adminpage: false
      })
      const [showAdminOptions, setAdminOptions] = useState({
        adminoptions: true
      })
      const [showAdminTitle, setAdminTitles] = useState({
        admintitle: false
      })
      const [nonadminusers, setNonAdminUsers] = useState({
        nonadminusers: []
      })
      const [titleadminusers, setTitleAdminUsers] = useState({
        titleadminusers: []
      })
    
      const componentMounted = useRef(null);
    
      useEffect(() => {
        componentMounted.current = true;
        setTimeout(() => {
          if (componentMounted.current) {
            if (adminportal !== true) {
              fetch('/api/group/getportalusers/' + groupres.groupres.groupid)
              .then((res) => {
                return res.json();
              }).then((bod) => {
                setNonAdminUsers({
                  nonadminusers: bod
                })
              }).catch((error) => {
                console.log(error);
              })
    
              fetch('/api/group/getusers/' + groupres.groupres.grouptype + '/' + groupres.groupres.groupid)
              .then((res) => {
                return res.json()
              }).then((body) => {
                setTitleAdminUsers({
                  titleadminusers: body
                })
              }).catch((error) => {
                console.log(error);
              })
             }
          }
        }, 400);
    
        return () => { componentMounted.current = false }
      }, [adminportal])
    
       const OutputOptionsUser = ({adminoptions}) => {
         if (adminoptions === true) {
            if (nonadminusers.nonadminusers.length > 0) {
              return (
              <div>
                    {
                       nonadminusers.nonadminusers.map((item) => (
                          <div key={nonadminusers.nonadminusers.indexOf(item)}>
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
                                      setNonAdminUsers({
                                        nonadminusers: body
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
                                        setNonAdminUsers({
                                          nonadminusers: bod
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
          if (titleadminusers.titleadminusers.length > 0) {
            return (
              <div>
                {
                  titleadminusers.titleadminusers.map((item) => (
                    <div key={titleadminusers.titleadminusers.indexOf(item)}>
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
                              fetch('/api/group/giveusertitle/' + groupres.groupres.grouptype + '/' + groupres.groupres.groupid  + '/' + item.useruid , {
                                method: 'PUT',
                                body: e.target.value
                              }).then(() => {
                                fetch('/api/group/getusers/' + groupres.groupres.grouptype + '/' + groupres.groupres.groupid)
                                .then((res) => {
                                  return res.json()
                                }).then((body) => {
                                  setTitleAdminUsers({
                                    titleadminusers: body
                                  })
                                }).catch((error) => {
                                  console.log(error);
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
    
    
       const AdminPage = ({adminpage}) => {
         if (adminpage === true) {
           return (
            <div className="modal-edu-white">
            <div className="container">
             <div className="modal-padding">
              <div className="modal-container">
              <span className="closebtndark" onClick={() => {
                  setAdminPage({
                    adminpage: false
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
           )
         } else {
           return null;
         }
       }
    
    
      if (adminportal === true) {
        return (
          <div>
            <div className="button-padding">
               <button className="button-submit-blue" onClick={() => {
                  setAdminPage({
                       adminpage: true
                    })
               }}>ADMIN PORTAL</button>
            </div>
            <AdminPage adminpage={showAdminPage.adminpage}/>
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

   const GroupDetails = ({groupdetails}) => {
    const [adminuser , setAdminUser] = useState({
      adminuser: false
    })

    const subComp = useRef(null);

    const fetchAdminStatus = useCallback(() => {
      if (groupdetails === true) {
        if (subComp.current) {
          if (groupres.groupres.grouptype !== undefined){
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
        }
      }

      return () => {subComp.current = false}

    }, [groupdetails])

    useEffect(() => {
      subComp.current = true
      setTimeout(() => {
        fetchAdminStatus()
      }, 500);
      return () => {subComp.current = false}
    }, [fetchAdminStatus])

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
                    <AdminPortal adminportal={adminuser.adminuser} groupid={groupres.groupres.groupid} grouptype={groupres.groupres.grouptype}/>
                  </div>
                  <h3>GROUP MEMBERS</h3>
                  <div className="row">
                    {
                      userdetails.userdetails.map(item => (
                        <div key={userdetails.userdetails.indexOf(item)}>
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

    /*
                  <MainChatShow
                mainchatshow={mainchat.mainchat}
                groupname={groupres.groupres.groupname}
                mainchatid={groupres.groupres.mainchatid}
                groupid={groupres.groupres.groupid}
                grouptype={groupres.groupres.typeofgroup}
                />
    */

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
               <div className="group-title-page">
                <h3>{groupres.groupres.groupname}</h3>
               </div>
               <div className="group-navigation">
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
                <Posts 
                grouptype={groupres.groupres.grouptype} 
                groupid={groupres.groupres.groupid} 
                wallpostid={groupres.groupres.wallpostid} 
                visible={wallpost.wallpost}
                />
                <ConnectionsHome
                connectionhome={groupconnectivity.groupconnectivity}
                groupclientid={groupres.groupres.clientid}
                groupname={groupres.groupres.groupname}
                groupid={groupres.groupres.groupid}
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
              </div>
             <GroupDetails groupdetails={groupdetails.groupdetails}/>
             <LeaveGroupModal leavegroupmodal={leavegroupmodal.leavegroupmodal}/>
             <Addusers addusersmodal={addusersmodal.addusersmodal}/>
            </div>
            </div>
        )
}

export default Group;