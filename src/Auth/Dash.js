import React, {useState, useEffect, useRef} from 'react';
import Authnav from './Authcomps/Authnav';
import {NavLink} from 'react-router-dom';
import firebase from '../ServerSide/basefile';
import {generateId, MinimizeBigTitle} from '../ServerSide/functions';
import LoadingWhite from '../Comps/Loadingwhite';
import LoadingBlue from '../Comps/Loadingblue';


const Dash = () => {
    //states
    const [subres, setSubRes] = useState({
        subres: []
    })
    const [response, setResponse] = useState({
        response: []
    })
    const [modalopened, setModalOpened] = useState({
        modalopened: false
    })
    const [loading, setLoading] = useState({
        loading: false
    })
    const [groupoutput, setGroupOutput] = useState({
        groupoutput: true
    })
    const [subgroupoutput, setSubGroupOutput] = useState({
        subgroupoutput: false
    })

    const componentMounted = useRef(null)

    useEffect(() => {
        setLoading({
            loading: true
        })
        componentMounted.current = true
            setTimeout(() => {
                if (componentMounted.current) {
                fetch('/api/group/getgroups/' + firebase.auth().currentUser.uid)
                .then((res) => {
                    return res.json();
                }).then((body) => {
                    setResponse({
                        response: body
                    })
                    setLoading({
                        loading: false
                    })
                }).catch((error) => {
                    console.log(error)
                })
                }
               }, 500);
    
               fetch('/user/getusersubs/' + firebase.auth().currentUser.uid)
               .then((res) => {
                   return res.json();
               }).then((body) => {
                   setSubRes({
                       subres: body
                   })
               }).catch((error) => {
                   console.log(error);
             }) 
           

           return () => {componentMounted.current = false}
    }, [])



  const ModalCreate = ({modalopened}) => {
        const [allusers, setAllusers] = useState({
            allusers: []
        })
        const [makinggroup, setMakingGroup] = useState({
            makinggroup: false
        })
        const [modalform, setModalForm] = useState({
            modalform: true
        })
        const [finalgroupname, setFinalGroupName] = useState({
            finalgroupname: ''
        })

        const subComponentMounted = useRef(null);

        useEffect(() => {
          subComponentMounted.current = true;
          if (subComponentMounted.current) {
            if (modalopened === true) {
            fetch('/user/getallusers')
            .then((res) => {
              return res.json();
            }).then((body) => {
              const newbody = body.filter(index => index.useruid !== firebase.auth().currentUser.uid)
              setAllusers({
                  allusers: newbody
              })
             }).catch((error) => {
              console.log(error)
            })
            }
          }

          return () => {subComponentMounted.current = false}
        }, [modalopened])
        

        const ModalForm = ({modalform}) => {
            const [groupname, setGroupName] = useState({
                groupname: ''
            })
            const[groupdescription, setGroupDescription] = useState({
                groupdescription: ''
            })
            const[usersadded] = useState({
                usersadded: []
            })
            const [suggestions, setSuggestions] = useState({
                suggestions: []
            })
            const [grouptype, setGroupType] = useState({
                grouptype: 'BASICGROUPS'
            }) 

            const RenderSuggestions = () => {
                if (suggestions.suggestions.length === 0) {
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
                                      usersadded.usersadded.push(item.useruid)
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

            const ShowGroupTitleOnCreate = () => {
                if (groupname.groupname.length > 0) {
                    return (
                        <div>
                         <h4>{"What kind of group is " + groupname.groupname + "?"}</h4>
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

            if (modalform === true) {
              return (
                <div>
                    <span className="closebtndark" onClick={() => {
                            setModalOpened({
                                modalopened: false
                            })
                        }} >&times;</span>
                        <h3 className="text-center">CREATE GROUP</h3>
                        <div className="input-container">
                            <div className="group">      
                                <input type="text" className="inputbar" name="groupname" onChange={(e) => {
                                    setGroupName({
                                     groupname: e.target.value
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
                                    setGroupDescription({
                                     groupdescription: e.target.value
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
                                   setGroupType({
                                        grouptype : "BASICGROUPS"
                                    })
                                } else if (e.target.value === "Organizational Group") {
                                    setGroupType({
                                        grouptype : "ORGANIZATIONALGROUPS"
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
                                    let suggestionsmade = [];
                                    if (e.target.value.length > 0) {
                                        const regex = new RegExp(`^${e.target.value}` , 'i');
                                        suggestionsmade = allusers.allusers.sort().filter(v => regex.test(v.firstname))
                                    }
  
                                    setSuggestions({
                                        suggestions: suggestionsmade
                                    })
                                }} required />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className="labelbar">People you want to add</label>
                            </div>
                            <RenderSuggestions/>
                        </div>
                        <div className="input-container">
                            <button className="button-submit" onClick={(e) => {
                                setFinalGroupName({
                                    finalgroupname: groupname.groupname
                                })
                                const users = [];
                                users.push(firebase.auth().currentUser.uid);
                                const adminusers = [];
                                adminusers.push(firebase.auth().currentUser.uid);
                                let data;
                                if (grouptype.grouptype === "BASICGROUPS") {
                                    data = {
                                        groupname: groupname.groupname,
                                        groupdescription: groupdescription.groupdescription,
                                        usersadded: usersadded.usersadded,
                                        creator: firebase.auth().currentUser.uid,
                                        typeofgroup: grouptype.grouptype,
                                        adminusers: adminusers,
                                        users: users
                                    }
                                } else if (grouptype.grouptype === "ORGANIZATIONALGROUPS") {
                                    data = {
                                        groupname: groupname.groupname,
                                        groupdescription: groupdescription.groupdescription,
                                        usersadded: usersadded.usersadded,
                                        creator: firebase.auth().currentUser.uid,
                                        grouptype: grouptype.grouptype,
                                        adminusers: adminusers,
                                        users: users,
                                        clientid: groupname.groupname.replace(" " , "")                               
                                    }
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
                                }).then((body) => {
                                    response.response.push(body);
                                    setResponse({
                                        response: response.response
                                    })
                                    setModalForm({
                                        modalform: false
                                    })
                                    setMakingGroup({
                                        makinggroup: true
                                    })
                                    
                                    setTimeout(() => {

                                        setModalForm({
                                            modalform: true
                                        })
                                        setMakingGroup({
                                            makinggroup: false
                                        })
                                        setModalOpened({
                                            modalopened: false
                                        })
                                    }, 4000);

                                }).catch((error) => {
                                    console.log(error);
                                })                       
                              }}>
                                SUBMIT
                     </button>
                  </div>
                </div>
              )
            } else {
                return null
            }
        }

        if (modalopened === true) {
            return (
                <div>
                  <div className="modal-edu">
                    <div className="container">
                     <div className="modal-padding">
                      <div className="modal-container">
                        <ModalForm modalform={modalform.modalform}/>
                        <LoadingBlue loading={makinggroup.makinggroup} statement={`Creating ${finalgroupname.finalgroupname} Group`}/>
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


    const Groupoutput = ({groupoutput}) => {
         if (groupoutput === true) {
            return (
                <div>
                <div className="g-container">
                <div className="row">
                  {
                      response.response.map(item => (
                          <div key={item.clientid}>
                           <div className="group-spacing">
                           <NavLink className="groupnav slightshadow" to={"/group/" + item.groupapi}>
                            <div className={"groupcard-" + item.typeofgroup}>
                                <h3 className="text-center">{MinimizeBigTitle(item.groupname)}</h3>
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
         } else {
             return null
         }
     }

    const SubGroupOutput = ({subgroupoutput}) => {
        if (subgroupoutput === true) {
            return (
                <div>
                <div className="g-container">
                <div className="row">
                  {
                      subres.subres.map(item => (
                          <div key={subres.subres.indexOf(item)}>
                           <div className="group-spacing">
                           <NavLink className="groupnav slightshadow" to={"/subgroup/" + item.grouptype + '/' + item.maingroupapi + "/" + item.subgroupapi}>
                            <div className="subgroupcard">
                                <h3 className="text-center">{item.subgroupname}</h3>
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
        } else {
            return null;
        }
     }

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
                        setModalOpened({
                            modalopened: true
                        })
                    }}>CREATE GROUP</button>
                 </div>
                 </div>
                 <div>
                   <div className="float-left">
                   <div className="row">
                    <div className="col-md-6">
                     <div className="button-padding">
                     <NavLink className="navlink" to="/pending">
                      <button className="button-submit-white">PENDING GROUPS</button> 
                     </NavLink>
                     </div>
                    </div>
                    <div className="col-md-3">
                    <div className="button-padding">
                    <button className="button-submit" onClick={() => {
                        setGroupOutput({
                            groupoutput: true
                        })
                        setSubGroupOutput({
                            subgroupoutput: false
                        })
                    }}>GROUPS</button>
                    </div>
                    </div>
                    <div className="col-md-3">
                    <div className="button-padding">
                    <button className="button-submit-blue" onClick={() => {
                       setSubGroupOutput({
                           subgroupoutput: true
                       })
                       setGroupOutput({
                           groupoutput: false
                       })
                    }}>SUBGROUPS</button>
                    </div>
                    </div>
                   </div>
                   </div>
                 </div>
                </div>
                <LoadingWhite loading={loading.loading} />
                <Groupoutput groupoutput={groupoutput.groupoutput}/>
                <SubGroupOutput subgroupoutput={subgroupoutput.subgroupoutput}/>
                </div>
               </div>
             </div>
             <ModalCreate modalopened={modalopened.modalopened}/>
            </div>
        )
}

export default Dash;