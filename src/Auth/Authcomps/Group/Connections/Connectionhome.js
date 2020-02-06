import React, {useState, useEffect, useRef} from 'react';
import LoadingBlue from '../../../../Comps/Loadingblue';
import axios from 'axios'
const ConnectionsHome = ({connectionhome , groupclientid, groupname, groupid}) => {
    const [pageload, setPageLoad] = useState({
        pageload: true
    })
    const [connectionsmade, setConnectionsMade] = useState({
        connectionsmade: []
    }) 
    const [connectionmodal, setConnectionModal] = useState({
        connectionmodal: false
    })
    const [connectionResults, setConnectionResult] = useState({
        connectionResults: false
    })
    const [requestconnection, setRequestConnection] = useState({
        requestconnection: {}
    })
    const [finalconnectionname, setFinalConnectionName] = useState({
        finalconnectionname: ''
    })

    const componentMounted = useRef(null);

    useEffect(() => {
     componentMounted.current = true;
     if (componentMounted.current) {
        axios.get('https://vincobackend.herokuapp.com/connection/fetchconnections/' + groupid)
        .then((body) => {
            setConnectionsMade({
                connectionsmade: body.data
            })
            setPageLoad({
                pageload: false
            })
        }).catch((error) => {
            console.log(error);
        })
     }

     return () => {componentMounted.current = false}
    }, [groupid])
 
    const ShowConnectionGroups = () => {
        if (connectionsmade.connectionsmade.length > 0) {
            return (
                <div>
                 <div className="row">
                    {
                        connectionsmade.connectionsmade.map((item) => (
                            <div key={connectionsmade.connectionsmade.indexOf(item)}>
                              <div className="group-spacing">
                              <div className="pending-group-card-blue slightshadow">
                              <div className="pending-group-card-padding">
                                <h5 className="text-center">{item.connectionname}</h5>
                              </div>
                              </div>
                              </div>
                            </div>
                        ))
                    }
                 </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className="connections-container-empty">
                        <div className="no-connections-container">
                        <h3>{groupname + ' has no connections made with any other groups'}</h3>
                        <div className="button-padding">
                        <button className="button-submit justify-content-center" onClick={() => {
                           setConnectionModal({
                               connectionmodal: true
                           })
                        }}>MAKE A CONNECTION</button>
                        </div>
                        </div>
                    </div>
                </div>
            )
        }
    }


    const PendingConnections = () => {
        const [pendingConnections, setPendingConnections] = useState({
            pendingConnections: false
        })

        const PendingGroups = () => {
        const [pendingGroups, setPendingGroups] = useState({
          pendingGroups: []
        })

        const subComponent = useRef(null);

        useEffect(() => {
         subComponent.current = true
         if (subComponent.current) {
            axios.get('https://vincobackend.herokuapp.com/connection/getpendingconnections/' + groupid)
            .then((body) => {
                setPendingGroups({
                    pendingGroups: body.data
                })
            }).catch((error) => {
                console.log(error);
            })
         }

         return () => {subComponent.current = false}
        }, [])

        if (pendingGroups.pendingGroups.length > 0) {
            return (
                <div>
                 <div className="row">
                  {
                      pendingGroups.pendingGroups.map((item) => (
                          <div key={pendingGroups.pendingGroups.indexOf(item)}>
                             <div className="group-spacing">
                             <div className="pending-card">
                               <h4 className="text-center">{item.connectionname}</h4>
                               <div className="d-flex justify-content-center">
                               <button className="button-submit-white" onClick={() => {
                                   axios.get('https://vincobackend.herokuapp.com/connection/createconnection/' + item.responseclientid + '/' + item.requestedclientid + '/' + item.pathconnectionid)
                                   .then((body) => {
                                    connectionsmade.connectionsmade.push(body.data);
                                    setConnectionsMade({
                                        connectionsmade: connectionsmade.connectionsmade
                                    })
                                    setPendingConnections({
                                        pendingConnections: false
                                    })
                                  }).catch((error) => {
                                    console.log(error);
                                  })
                               }}>CONNECT</button>
                               </div>
                             </div>
                             </div>
                          </div>
                      ))
                  }
                 </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className="group-component-padding">
                      <h3 className="text-center">THERE ARE NO PENDING CONNECTIONS</h3>
                    </div>
                </div>
            )
        }
        
        }
        
        const PendingPage = ({pendingpage}) => {
            if (pendingpage === true) {
                return (
                    <div>
                     <div className="modal-edu">
                     <div className="container">
                      <div className="modal-padding">
                        <div className="modal-container">
                        <span className="closebtndark" onClick={() => {
                            setPendingConnections({
                                pendingConnections: false
                            })
                        }}>&times;</span>
                        <h2>{`${groupname} Connections`}</h2>
                        <div className="title-padding">
                         <PendingGroups/>
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

         return (
             <div>
              <div className="button-padding">
                <button className="button-submit-blue" onClick={() => {
                    setPendingConnections({
                        pendingConnections: true
                    })
                }}>PENDING CONNECTIONS</button>
                <PendingPage pendingpage={pendingConnections.pendingConnections}/>
              </div>
             </div>
         )
    }
    
    const ConnectionResults = ({connectionresults , currentrequest}) => {
     if (connectionresults === true) {
        return (
            <div>
            <div className="modal-edu">
             <div className="container">
              <div className="modal-padding">
               <div className="modal-container">
                <span className="closebtndark" onClick={() => {
                  setConnectionModal({
                      connectionmodal: true
                  })
                  setConnectionResult({
                      connectionResults: false
                  })
                }}>&times;</span>
               <div className="title-padding">
               <h2>{currentrequest.groupname}</h2>
               </div>
               <h5>{"GROUP CODE: " + currentrequest.clientid}</h5>
               <h4>{currentrequest.groupdescription}</h4>
               <div className="button-padding justify-content-center">
                <button className="button-submit" onClick={() => {
  
                  const data = {
                    requestedclientid: currentrequest.clientid,
                    responseclientid: groupclientid,
                    requestedgroupname: currentrequest.groupname,
                    responsegroupname: groupname,
                    connectionname: finalconnectionname.finalconnectionname
                  }
  
                 
                  
                  axios.put('https://vincobackend.herokuapp.com/connection/requestconnection/' + data.responseclientid + '/' + data.requestedclientid, data,{
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                  }).then(() => {
                    setConnectionResult({
                        connectionResults: false
                    })
                  }).catch((error) => {
                    console.log(error)
                  })
                  
  
                }}>CONNECT</button>
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


     const RequestModal = () => {
            const [error, setError] = useState({
                error: false 
            })
            
            const ErrorMsg = ({errormessage}) => {
                if (errormessage === true) {
                   return (
                       <div>
                         <div className="error-message">
                         <h6>You can not connect with your own group</h6>
                         </div>
                       </div>
                   )
                } else {
                    return null
                }
            }


        const ModalRequest = ({requestmodal}) => {
            const [connectioninput, setConnectionInput] = useState({
               connectioninput: ''
             })
            const [connectionname, setConnectionName] = useState({
                connectionname: ''
            })
            if (requestmodal === true) {
                return (
                    <div>
                        <div>
                            <div className="modal-edu">
                            <div className="container">
                                <div className="modal-padding">
                                <div className="modal-blue-container">
                                <span className="closebtnwhite" onClick={() => {
                                    setConnectionModal({
                                        connectionmodal: false
                                    })
                                }}>&times;</span>
                                <div className="thirty-padding">
                                    <h3>SEARCH THE GROUP YOU WANT CONNECT WITH</h3>
                                    <h6>Give the connectiona a name and the group code to find the group to connect with</h6>
                                    <div className="input-container">
                                    <ErrorMsg errormessage={error.error}/>
                                    <div className="group">      
                                            <input type="text" className="inputbar-white" name="connectionname" onChange={(e) => {
                                                        setConnectionName({
                                                        connectionname: e.target.value
                                                        })
                                                    }} onKeyDown={(e) => {
                                                        if (e.keyCode === 13) {
                                                            console.log('something')
                                                        }
                                                    }} required />
                                                    <span className="highlight-white"></span>
                                                    <span className="bar-white"></span>
                                                    <label className="labelbar-white">Give the connection a name</label>
                                    </div>
                                    </div>
                                    <div className="input-container">
                                    <ErrorMsg errormessage={error.error}/>
                                    <div className="group">      
                                            <input type="text" className="inputbar-white" name="connectioninput" onChange={(e) => {
                                                        setConnectionInput({
                                                        connectioninput: e.target.value
                                                        })
                                                    }} onKeyDown={(e) => {
                                                        if (e.keyCode === 13) {
                                                            console.log('something')
                                                        }
                                                    }} required />
                                                    <span className="highlight-white"></span>
                                                    <span className="bar-white"></span>
                                                    <label className="labelbar-white">Search Group by code</label>
                                    </div>
                                    </div>
                                    <div className="button-padding">
                                    <button className="button-white" onClick={() => {
                                    if (connectioninput.connectioninput !== groupclientid) {
                                        axios.get('https://vincobackend.herokuapp.com/connection/getgroup/' + connectioninput.connectioninput)
                                        .then((bod) => {
                                            setFinalConnectionName({
                                                finalconnectionname: connectionname.connectionname
                                            })
                                            setConnectionResult({
                                                connectionResults: true
                                            })
                                            setConnectionModal({
                                                connectionmodal: false
                                            })
                                            setRequestConnection({
                                                requestconnection: bod.data
                                            })
                                        }).catch((error) => {
                                        console.log(error)
                                        })
                                    } else {
                                       setError({
                                           error: true
                                       })
                                    }
                                    }}>SEARCH</button>
                                    </div>
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

            return (
                <div>
                <div className="button-padding">
                <button className="button-submit justify-content-center" onClick={() => {
                 setConnectionModal({
                     connectionmodal: true
                 })
               }}>MAKE A CONNECTION</button>
                </div>
               <ModalRequest requestmodal={connectionmodal.connectionmodal}/>
                </div>
            )
        }
    
    if (connectionhome === true) {
       return (
        <div>
        <div className="connection-home">
         <div className="row">
         <div className="col-md-6">
          <h1>Connections</h1>
         </div>
         <div className="col-md-6">
          <div className="row">
            <div className="col-md-6">
            <RequestModal requestmodal={connectionmodal.connectionmodal}/>
            </div>
            <div className="col-md-6">
            <PendingConnections/>
            </div>
          </div>
         </div>
         </div>
        <ShowConnectionGroups/>
        <LoadingBlue loading={pageload.pageload}/>
        <ConnectionResults currentrequest={requestconnection.requestconnection} connectionresults={connectionResults.connectionResults}/>
        </div>
        </div>
       )
    } else {
        return null;
    }
}

export default ConnectionsHome