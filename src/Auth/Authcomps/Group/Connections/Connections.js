import React from 'react';
import LoadingBlue from '../../../../Comps/Loadingblue';
import {generateId} from '../../../../ServerSide/functions';
import firebase from '../../../../ServerSide/basefile';

class ConnectionComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      res: [],
      comment: ''
    }
  }

  fetchComments = () => {
    setTimeout(() => {
      fetch('/connection/getcomments/' + this.props.connectionid + '/' + this.props.postid)
      .then((res) => {
        return res.json();
      }).then((bod) => {
        this.setState({
          res: bod
        })
      }).catch((error) => {
        console.log(error);
      })
    }, 400);
  }

  componentDidMount() {
    this.fetchComments();
  }

  ShowCommentsOnPost = () => {
    return (
      <div>
        <div className="input-container">
        {
          this.state.res.map(item => (
            <div key={this.state.res.indexOf(item)}>
              <div className="comment-container">
                <h6 className="comment d-inline-flex p-2">{item.displayname + ': ' + item.message}</h6>
              </div>
            </div>
          ))
        }
        </div>
      </div>
    )
  }


  render() {
    return (
      <div>
        <div className="input-container">
        <input type="text" className="input-comment-blue" placeholder="Comment here..." name="comment" onChange={(e) => {
          this.setState({
            [e.target.name]: e.target.value
          })
        }} onKeyDown={(e) => {
          if (e.keyCode === 13) {
            const data = {
              commentid: generateId(70),
              displayname: firebase.auth().currentUser.displayName,
              message: this.state.comment,
              creator: firebase.auth().currentUser.uid,
              date: new Date()
            }
            
            fetch("/connection/comment/" + this.props.connectionid + '/' + this.props.postid , {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            }).then(() => {
              this.fetchComments();
            }).catch((error) => {
              console.log(error);
            })
          }
        }}/>
        <this.ShowCommentsOnPost/>
        </div>
      </div>
    )
  }
}

class Connection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      res: [],
      postconnections: false,
      connectionpost: '',
      openfilemodal: false,
      boxfilerres: [],
      inputfile: '',
      inputfolderid: '',
      inputfileid: '',
      inputfileurl: '',
      postres: [],
      currentpost: [],
      postmodal: false
    }
  }

  fetchPosts = () => {
    setTimeout(() => {
     fetch('/connection/getposts/' + this.state.res.connectionid)
     .then((res) => {
       return res.json();
     }).then((bod) => {
       this.setState({
        postres: bod
       })
     }).catch((error) => {
       console.log(error);
     })
    }, 490);
  }

  componentDidMount() {
    this.setState({
      res: this.props.details
    })
    
    this.fetchPosts();

    setTimeout(() => {
      fetch('/api/boxfiler/getfolders/' + this.props.grouptype  + '/' + this.props.groupid + '/' + this.props.boxfilerid)
      .then((res) => {
        return res.json();
      }).then((body) => {
        this.setState({
          boxfilerres: body
        })
      }).catch((error) => {
        console.log(error);
      })
    }, 500);
  }

  PostModalConnection = ({postconnections}) => {
    if (postconnections === true) {
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
                    <button className="plain-btn-statement" onClick={() => {
                      this.setState({
                        openfilemodal: true
                      })
                    }}>CHOOSE FILE FROM FOLDER</button>
                    </div>
                   </div>
                   <div className="col-md-2">
                   <button className="button-submit-blue" onClick={() => {
                     const data = {
                       message: this.state.connectionpost,
                       file: this.state.inputfile,
                       postid: generateId(79),
                       creator: firebase.auth().currentUser.uid,
                       displayName: firebase.auth().currentUser.displayName,
                       date: new Date().getMonth() + '/' + new Date().getDate() + '/' + new Date().getFullYear()  + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
                       servertimestamp: new Date(),
                       fileboxfilerid: this.props.boxfilerid,
                       groupid: this.props.groupid,
                       fileid: this.state.inputfileid,
                       fileurl: this.state.inputfileurl
                     }

                     
                     fetch('/connection/makepost/' + this.state.res.connectionid, {
                       method: 'PUT',
                       headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(data)
                     }).then(() => {
                       console.log('this worked')
                       this.fetchPosts();
                       this.setState({
                         openfilemodal: false
                       })
                     }).catch((error) => {
                       console.log(error);
                     })
                     
                   }}>POST</button>
                   </div>
                  </div>
                </div>
              </div>
              </div>
              <div className="show-post-container">
                <h6>{firebase.auth().currentUser.displayName}</h6>
                <h6>{"ATTACHED: " + this.state.inputfile}</h6>
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

  PostModal = ({postmodal, details}) => {
    if (postmodal === true) {
      if (details.fileurl === "") {
        return (
          <div>
            <div className="modal-edu">
             <div className="container">
              <div className="modal-padding">
               <div className="modal-container">
                <span className="closebtndark" onClick={() => {
                  this.setState({
                    postmodal: false
                  })
                }}>&times;</span>
                <h6>{details.displayName}</h6>
                <div className="title-padding">
                 <h4>{details.message}</h4>
                 <ConnectionComments connectionid={this.state.res.connectionid} postid={this.state.currentpost.postid}/>
                </div>
               </div>
              </div>
             </div>
            </div>
          </div>
        )
      } else {
        return (
          <div>
            <div className="modal-edu">
             <div className="container">
              <div className="modal-padding">
               <div className="modal-container">
                 <span className="closebtndark" onClick={() => {
                   this.setState({
                     postmodal: false
                   })
                 }}>&times;</span>
                  <div className="row">
                    <div className="col-md-8">
                    {/* File viewer */}
                    </div>
                    <div className="col-md-4">
                     <ConnectionComments connectionid={this.state.res.connectionid} postid={this.state.currentpost.postid} />
                    </div>
                  </div>
               </div>
              </div>
             </div>
            </div>
          </div>
        )
      }
    } else {
      return null
    }
  }

  ShowAllPosts = () => {
    const ImageIncluded = ({fileurl}) => {
        if (fileurl !== '') {
          return (
            <div>
              <h5>FILE INCLUDED</h5>
            </div>
          )
        } else {
          return null
        }
      }
  
      return (
        <div>
          {
            this.state.postres.map(item => (
              <div key={this.state.postres.indexOf(item)}>
                <div className="post-spacing">
                 <div className="slightshadow">
                  <div className="post"  onClick={() => {
                      this.setState({
                        currentpost: item,
                        postmodal: true
                      })
                    }}>
                  <div className="row">
                    <div className="col-md-10">
                     <h6>{item.displayName}</h6>
                    </div>
                    <div className="col-md-2">
                     <h6>{item.date}</h6>
                    </div>
                  </div>
                  <div className="title-padding">
                   <div className="row">
                     <div className="col-md-10">
                     <h4>{item.message}</h4>
                     </div>
                     <div className="col-md-2">
                       <ImageIncluded fileurl={item.fileurl}/>
                     </div>
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
    }

  ModalInputFile = ({openfilemodal}) => {
    if (openfilemodal === true) {
      return (
        <div>
          <div className="modal-edu">
           <div className="container">
            <div className="modal-padding">
              <div className="modal-container">
                <span className="closebtndark" onClick={() => {
                  this.setState({
                    openfilemodal: false
                  })
                }}>&times;</span>
               <h3>CHOOSE FOLDER</h3>
               <div className="input-container">
                {
                  this.state.boxfilerres.map(item => (
                    <div key={this.state.boxfilerres.indexOf(item)}>
                      <div className="folder-component-padding">
                             <div className="folder-output" onClick={() => {
                                 const foldername = document.getElementById(item.foldername);
                                 if (foldername.classList.contains('hide') === true) {
                                     foldername.classList.remove('hide');
                                 } else {
                                     foldername.classList.add('hide');
                                 }
                             }}>
                                <h6 className="folder-subheader">{item.files.length + " files"}</h6>
                                <h4>{item.foldername}</h4>
                             </div>
                             <div id={item.foldername} className="file-components hide">
                              {
                                  item.files.map(index => (
                                      <div key={item.files.indexOf(index)}>
                                          <div className="file-output" onClick={() => {
                                            firebase.storage().ref(this.props.groupid + '/' + this.props.boxfilerid + '/' + item.folderid + '/' + index.filename)
                                            .getDownloadURL().then((url) => {
                                                var xhr = new XMLHttpRequest();
                                                xhr.responseType = 'blob';       
                                                xhr.open('GET', url);
                                                xhr.send();
                                                this.setState({
                                                  inputfile: index.filename,
                                                  openfilemodal: false,
                                                  inputfolderid: item.folderid,
                                                  inputfileid: index.fileid,
                                                  inputfileurl: url
                                                })
                                                })
                                          }}>
                                            <h6>{index.filename}</h6>
                                          </div>
                                      </div>
                                  ))
                              }
                             </div>
                             </div>
                    </div>
                  ))
                }
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
          <div className="input-container">
           <this.ShowAllPosts/>
          </div>
        </div>
        <this.PostModalConnection postconnections={this.state.postconnections} />
        <this.ModalInputFile openfilemodal={this.state.openfilemodal}/>
        <this.PostModal details={this.state.currentpost} postmodal={this.state.postmodal}/>
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
                  console.log('we are working on it')
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
      totalload: true,
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
      currentconnectiondetails: [],
      errormessage: ''
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
            totalload: false,
            connectionsavailable: true,
            allconnections: body
          })
        } else {
          this.setState({
            totalload: false,
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
                   errormessage: ''
                 })
               }}>&times;</span>
               <div className="thirty-padding">
                <h3>SEARCH THE GROUP YOU WANT CONNECT WITH</h3>
                <h6>Use a group code to find the group to connect with</h6>
                <div className="input-container">
                <div className="error-message">
                <h6>{this.state.errormessage}</h6>
                </div>
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
                   if (this.state.connectioninput !== this.props.groupclientid) {
                    fetch('/connection/getgroup/' + this.state.connectioninput)
                    .then((res) => {
                      return res.json()
                    }).then((bod) => {
                       this.setState({
                         connectiongroup: true,
                         loadingconnectiongroup: true,
                         connectionmodal: false,
                         errormessage: ''
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
                   } else {
                     this.setState({
                       errormessage: 'You can not connect with your own group'
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
         <div className="row">
         <div className="col-md-6">
          <h1>Connections</h1>
         </div>
         <div className="col-md-6">
          <div className="row">
            <div className="col-md-6">
            <button className="button-submit justify-content-center" onClick={() => {
                 this.setState({
                   connectionmodal: true
                 })
               }}>MAKE A CONNECTION</button>
            </div>
            <div className="col-md-6">
            <button className="button-submit-blue" onClick={() => {
              this.setState({
                renderpendingpage: true,
                connectionhome: false
              })
            }}>PENDING CONNECTIONS</button>
            </div>
          </div>
         </div>
         </div>
        <this.ConnectionsMade connectionsavailable={this.state.connectionsavailable}/>
        <this.MakeAConnectionModal connectionmodal={this.state.connectionmodal}/>
        <this.ConnectionGroupShow connectiongroup={this.state.connectiongroup} groupdetails={this.state.connectgroup}/>
        <LoadingBlue loading={this.state.totalload}/>
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
            <Connection groupid={this.props.groupid} boxfilerid={this.props.boxfilerid} details={connectiondetails}/>
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


const Connections = ({groupconnectivity , grouptype ,groupclientid ,groupname , groupid , boxfilerid}) => {
  if (groupconnectivity === true) {
    return (
      <div>
        <div className="group-page">
          <ConnectionPages grouptype={grouptype} groupclientid={groupclientid} boxfilerid={boxfilerid} groupname={groupname} groupid={groupid}/>
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default Connections;