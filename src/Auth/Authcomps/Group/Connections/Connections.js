import React from 'react';
import LoadingBlue from '../../../../NonAuth/Comps/Loadingblue';
import generateId from '../../../../ServerSide/generate';
import firebase from '../../../../ServerSide/basefile';

class Connection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      res: [],
      postconnections: false,
      connectionpost: ''
    }
  }

  componentDidMount() {
    this.setState({
      res: this.props.details
    })
  }

  PostModalConnection = ({postconnections}) => {
    if (postconnections === true) {
      console.log('hey hbh')
      return (
        <div>
          <div className="modal-edu">
           <div className="container">
            <div className="modal-padding">
             <div className="modal-container">
             <span className="closebtndark" onClick={() => {
               this.setState({
                postconnections: false
               })
             }}>&times;</span>
             <h2>CREATE A POST</h2>
             <div className="input-container">
              <div className="post-text-container slightshadow">
                <textarea className="post-white-text-area" placeholder="Make a post" name="connectionpost" onChange={(e) => {
                  this.setState({
                    [e.target.name]: e.target.value
                  })
                }} />
                <div className="post-option-buttons-container">
                  <div className="row">
                   <div className="col-md-3">
                     <button className="plain-btn-statement">ATTACH FILE</button>
                   </div>
                   <div className="col-md-7">
                    <div className="justify-content-center">
                    <button className="plain-btn-statement">CHOOSE FILE FROM FOLDER</button>
                    </div>
                   </div>
                   <div className="col-md-2">
                   <button className="button-submit-blue">POST</button>
                   </div>
                  </div>
                </div>
              </div>
              </div>
              <div className="show-post-container">
                <h6>{firebase.auth().currentUser.displayName}</h6>
                <div className="input-container">
                  <h4>{this.state.connectionpost}</h4>
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

 /*
  ModalInputFile = ({openfilemodal}) => {
    if (openfilemodal === true) {
      return (
        <div>

        </div>
      )
    } else {
      return null;
    }
  }
 */

  render() {
    console.log(this.state);
    return (
      <div>
        <div>
          <div className="float-right">
           <button className="button-submit-blue" onClick={() => {
             this.setState({
               postconnections: true
             })
           }}>MAKE A POST</button>
          </div>
          <h2>{this.state.res.requestedgroupname + ' and ' + this.state.res.connectedgroupname}</h2>
        </div>
        <this.PostModalConnection postconnections={this.state.postconnections} />
      </div>
    )
  }
}

class PendingConnections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingres: []
    }
  }

  fetchPendingGroups = () => {
    setTimeout(() => {
      fetch('/connection/getpendingconnections/' + this.props.groupid)
      .then((res) => {
        return res.json()
      }).then((bod) => {
        this.setState({
          pendingres: bod
        });
      }).catch((error) => {
        console.log(error);
      })
    } , 500);
  }

  componentDidMount() {
    this.fetchPendingGroups();
  }

  ShowPendingGroups = () => {
    return (
      <div>
        {
          this.state.pendingres.map(item => (
            <div key={this.state.pendingres.indexOf(item)}>
              <div className="group-spacing">
                <div className="pending-group-card slightshadow">
                <span className="details" onClick={() => {
                  this.setState({

                  })
                }}></span>
                <div className="pending-group-card-padding">
                  <h4 className="text-center">{item.requestedgroupname}</h4>
                  <button className="button-submit-lightblue" onClick={() => {
                    const data = {
                      connectedgroupid: item.connectedgroupid, 
                      requestedgroupid: item.requestedgroupid,
                      connectionid: item.connectionid,
                      connectedgroupname: item.connectedgroupname,
                      requestedgroupname: item.requestedgroupname
                    }
                    fetch('/connection/createconnection/' + item.connectedgroupid + '/' + item.requestedgroupid, {
                      method: 'PUT',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(data)
                    }).then(() => {
                      console.log('this did well')
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
    )
  }


  render () {
    console.log(this.state);
    return (
      <div>
         <h3>{this.props.groupname + 's Pending Groups'}</h3>
         <div className="row">
          <this.ShowPendingGroups/>
         </div>
      </div>
    )
  }
}

class ConnectionPages extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      connectionsavailable: '',
      connectionmodal: false,
      connectioninput: '',
      connectiongroup: false,
      connectgroup: [],
      loadingconnectiongroup: true,
      maingroupid: '',
      renderpendingpage: false,
      groupconnections: false,
      connectionhome: true,
      allconnections: [],
      currentconnectiondetails: []
    }
  }

  fetchConnections = () => {
    setTimeout(() => {
      fetch('/connection/fetchconnections/' + this.props.groupid)
      .then((res) => {
        return res.json();
      }).then((body) => {
        if (body.length > 0) {
          this.setState({
            connectionsavailable: true,
            allconnections: body
          })
        } else {
          this.setState({
            connectionsavailable: false
          })
        }
      }).catch((error) => {
        console.log(error);
      })
    }, 500);
  }

  componentDidMount() {
    this.fetchConnections();
  }

  ConnectionGroupShow = ({connectiongroup , groupdetails}) => {
    if (connectiongroup === true) {
      return(
        <div>
          <div className="modal-edu">
           <div className="container">
            <div className="modal-padding">
             <div className="modal-container">
              <span className="closebtndark" onClick={() => {
                this.setState({
                  connectiongroup: false,
                  connectionmodal: true,
                })
              }}>&times;</span>
             <div className="title-padding">
             <h2>{groupdetails.groupname}</h2>
             </div>
             <h5>{"GROUP CODE: " + groupdetails.clientid}</h5>
             <h4>{groupdetails.groupdescription}</h4>
             <div className="button-padding justify-content-center">
              <button className="button-submit" onClick={() => {
                this.setState({
                  connectiongroup: false,
                  connectionmodal: false
                })

                const data = {
                  connectionid: generateId(110),
                  requestedgroupid: this.props.groupid,
                  connectedgroupid: groupdetails.groupid,
                  requestedgroupname: this.props.groupname,
                  connectedgroupname: groupdetails.groupname
                }

                console.log(data);
               
                
                fetch('/connection/requestconnection/' + this.props.groupid + '/' + data.connectedgroupid, {
                  method: 'PUT',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
                }).then(() => {
                  console.log('it worked');
                }).catch((error) => {
                  console.log(error)
                })
                

              }}>CONNECT</button>
             </div>
             <LoadingBlue loading={this.state.loadingconnectiongroup}/>
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

  

  MakeAConnectionModal = ({connectionmodal}) => {
    if (connectionmodal === true) {
      return (
        <div>
          <div className="modal-edu">
           <div className="container">
            <div className="modal-padding">
              <div className="modal-blue-container">
               <span className="closebtnwhite" onClick={() => {
                 this.setState({
                   connectionmodal: false,
                 })
               }}>&times;</span>
               <div className="thirty-padding">
                <h3>SEARCH THE GROUP YOU WANT CONNECT WITH</h3>
                <h6>Use a group code to find the group to connect with</h6>
                <div className="input-container">
                <div className="group">      
                                <input type="text" className="inputbar-white" name="connectioninput" onChange={(e) => {
                                    this.setState({
                                    [e.target.name]: e.target.value
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
                 <div className="button-padding">
                  <button className="button-white" onClick={() => {
                    fetch('/connection/getgroup/' + this.state.connectioninput)
                    .then((res) => {
                      return res.json()
                    }).then((bod) => {
                       this.setState({
                         connectiongroup: true,
                         loadingconnectiongroup: true,
                         connectionmodal: false
                       })

                       setTimeout(() => {
                        this.setState({
                          connectgroup: bod,
                          loadingconnectiongroup: false,
                         })
                       } , 500)

                    }).catch((error) => {
                      console.log(error)
                    })
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

  ConnectionsMade = ({connectionsavailable}) => {
    if (connectionsavailable === true) {
      return (
        <div>
          {
            this.state.allconnections.map(item => (
              <div key={this.state.allconnections.indexOf(item)}>
                <div className="row">
                  <div className="group-spacing">
                    <div className="pending-group-card-blue slightshadow" onClick={() => {
                      this.setState({
                        currentconnectiondetails: item,
                        renderpendingpage: false,
                        groupconnections: true,
                        connectionhome: false,
                      })
                    }}>
                      <div className="pending-group-card-padding">
                       <h5 className="text-center">{item.requestedgroupname + ' + ' + item.connectedgroupname}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )
    } else if (connectionsavailable === false ) {
      return (
        <div>
          <div className="connections-container-empty">
            <div className="no-connections-container">
             <h3>{this.props.groupname + ' has no connections made with any other groups'}</h3>
             <div className="button-padding">
               <button className="button-submit justify-content-center" onClick={() => {
                 this.setState({
                   connectionmodal: true
                 })
               }}>MAKE A CONNECTION</button>
             </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }


  ConnectionHomePage = ({connectionhome}) => {
    if (connectionhome === true) {
      return (
        <div>
        <div className="connection-home">
        <div className="float-right">
        <button className="button-submit justify-content-center" onClick={() => {
                 this.setState({
                   connectionmodal: true
                 })
               }}>MAKE A CONNECTION</button>
        <button className="button-submit-white" onClick={() => {
          this.setState({
            renderpendingpage: true,
            connectionhome: false
          })
        }}>PENDING CONNECTIONS</button>
        </div>
        <h1>{this.props.groupname + "s Connections"}</h1>
        <this.ConnectionsMade connectionsavailable={this.state.connectionsavailable}/>
        <this.MakeAConnectionModal connectionmodal={this.state.connectionmodal}/>
        <this.ConnectionGroupShow connectiongroup={this.state.connectiongroup} groupdetails={this.state.connectgroup}/>
        </div>
        </div>
      )
    } else {
      return null
    }
  }

   RenderPending = ({renderpendingpage , groupname, groupid}) => {
    if (renderpendingpage === true) {
      return (
        <div>
          <div className="pendingPage">
           <div className="float-right">
            <button className="button-submit-blue" onClick={() => {
              this.setState({
                connectionhome: true,
                renderpendingpage: false
              })
            }}>CONNECTIONS</button>
           </div>
          <PendingConnections groupname={groupname} groupid={groupid} />
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  ConnectionGroups = ({seeconnection , connectiondetails}) => {
    if (seeconnection === true) {
      return (
        <div>
          <div className="connection-groups">
            <div className="float-right">
             <button className="button-submit" onClick={() => {
               this.setState({
                renderpendingpage: false,
                groupconnections: false,
                connectionhome: true,
               })
             }}>CONNECTIONS</button>
            </div>
            <Connection details={connectiondetails}/>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
  
  render() {
    return (
      <div>
        <div>
         <this.ConnectionHomePage connectionhome={this.state.connectionhome}/>
         <this.RenderPending groupid={this.props.groupid} groupname={this.props.groupname} renderpendingpage={this.state.renderpendingpage}/> 
         <this.ConnectionGroups seeconnection={this.state.groupconnections} connectiondetails={this.state.currentconnectiondetails}/>
        </div>
      </div>
    )
  }
}


const Connections = ({groupconnectivity , groupname , groupid}) => {
  if (groupconnectivity === true) {
    return (
      <div>
        <div className="connections-page">
          <ConnectionPages groupname={groupname} groupid={groupid}/>
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default Connections;