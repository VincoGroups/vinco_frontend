import React from 'react';
import generateId from '../../../../ServerSide/generate';
import firebase from '../../../../ServerSide/basefile';
import LoadingBlue from '../../../../NonAuth/Comps/Loadingblue';
class FileComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            outputfilecomment: '',
            outputfileres: []
        }
    }

   async componentDidMount() {
     await this.fetchFileComments();
    }

     fetchFileComments = () => {
        fetch('/api/boxfiler/getfilecomments/' + this.props.groupid + '/' + this.props.boxfilerid + '/' + this.props.currentfolderid + '/' + this.props.currentfileid)
        .then((res) => {
            return res.json();
        }).then((bod) => {
            this.setState({
                outputfileres: bod
            })
        }).catch((error) => {
            console.log(error);
        })
    }

    CommentOutput = () => {
        const outputdata = {
            comment: this.state.outputfilecomment,
            date: new Date(),
            creator: firebase.auth().currentUser.uid,
            displayname: firebase.auth().currentUser.displayName,
            commentid: generateId(54)
        }

        fetch('/api/boxfiler/commentonfile/' + this.props.groupid + '/' + this.props.boxfilerid + '/' + this.props.currentfolderid + '/' + this.props.currentfileid , {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(outputdata)
        }).then(() => {
         return this.fetchFileComments();
        }).catch((error) => {
            console.log(error);
        })
    }

    OutputComment = () => {
        return (
            <div>
                {
                    this.state.outputfileres.map(item => (
                        <div key={this.state.outputfileres.indexOf(item)}>
                            <div className="comment-container">
                              <h6 className="comment d-inline-flex p-2">{item.displayname + ': ' + item.comment}</h6>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }


    render() {
        console.log(this.state);
        return(
            <div>
                <input type="text" className="input-comment" name="outputfilecomment" onChange={(e) => {
                  this.setState({
                    [e.target.name] : e.target.value
                  })
                 }} onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                    this.CommentOutput();
                   }
                }} placeholder="Comment on this file..."/>
                <div className="input-container">
                <this.OutputComment/>
               </div>
            </div>
        )
    }
}
class Filer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foldermodal: false,
            foldername: '',
            groupresp : false,
            addfilemodal: false,
            currentfolderid: '',
            currentfoldername: '',
            currentfilename: '',
            currentfileid: '',
            outputfile: false,
            url:'',
            loading: true
        }
    }

    componentDidMount() {
       this.setState({
           loading: true
       })
       setTimeout(() => {
        this.fetchFolders();
       } , 500);
     }

     fetchFolders = () => {
        fetch('/api/boxfiler/getfolders/' + this.props.groupid + '/' + this.props.boxfilerid)
        .then((res) => {
            return res.json()
        }).then((bod) => {
            this.setState({
                groupresp: bod,
                loading: false
            })
        }).catch((error) => {
            console.log(error);
        })
     }

     

     OutputFiler = ({outputfile , url, currentfilename}) => {    
        if (outputfile === true) {
            return (
                <div>
                    <div className="modal-edu-white">
                        <div className="container">
                          <div className="modal-padding">
                             <span className="closebtndark" onClick={() => {
                                  this.setState({
                                      outputfile: false
                                  })
                              }}>&times;</span>
                              <h3>{currentfilename}</h3>
                              <div className="row">
                                <div className="col-md-4">
                                 <FileComments groupid={this.props.groupid} boxfilerid={this.props.boxfilerid} currentfolderid={this.state.currentfolderid} currentfileid={this.state.currentfileid} />
                                </div>
                                <div className="col-md-8">
                                 <embed className="fileoutput" title={currentfilename} src={url} width="100%"/>
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

     AddFileModal = ({addfilemodal , currentfolderid, currentfoldername}) => {
        if (addfilemodal === true) {
            return (
                <div>
                    <div className="modal-edu">
                      <div className="container">
                        <div className="modal-padding">
                         <div className="modal-header-blue">
                         <span className="closebtnwhite" onClick={() => {
                             this.setState({
                                 addfilemodal: false
                             })
                         }}>&times;</span>
                           <h2>{ 'Add Files to ' + currentfoldername}</h2>
                         </div>
                         <div className="modal-container">
                          <div className="box-blue" onDrop={(e) => {
                              e.preventDefault();
                              const files = e.dataTransfer.files;
                              const filedata = [];
                              for (let i = 0; i < files.length; i++) {
                                  const fileid = generateId(98);
                                  const filejson = {}
                                  filejson['filename'] = files[i].name;
                                  filejson['filetype'] = files[i].type;
                                  filejson['filesize'] = files[i].size;
                                  filejson['fileid'] = fileid
                                  filedata.push(filejson);
                             }

                              const data = {
                                  folderid: currentfolderid,
                                  filedata: filedata
                              }
                              
                              fetch('/api/boxfiler/addfiles/' + this.props.groupid + '/' + this.props.boxfilerid + '/' + data.folderid, {
                                  method: 'POST',
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify(data)
                              }).then((res) => {
                                  return res.json();
                              }).then((body) => {
                                  if(body.res === true) {
                                      for(let j = 0; j < files.length; j++) {
                                        firebase.storage().ref(this.props.groupid  + '/' + this.props.boxfilerid + '/' + data.folderid + '/' + files[j].name)
                                        .put(files[j]);
                                      }
                                      this.setState({
                                          addfilemodal: false
                                      })
                                  }
                              }).catch((error) => {
                                  console.log(error);
                              })
                          }} onDragOver={(e) => {
                              e.preventDefault();
                          }} onDragLeave={(e) => {
                              e.preventDefault();
                          }}>
                            <div className="row">
                             <div className="col-md-4">
                              <h3 className="text-center">DROP FILES HERE</h3>
                             </div>
                             <div className="col-md-4">
                              <h3 className="text-center">OR</h3>
                             </div>
                             <div className="col-md-4">
                              <input type="file" onChange={(e) => {
                                  const files = e.target.files;
                                  const filedata = [];
                                  for (let i = 0; i < files.length; i++) {
                                      const fileid = generateId(98);
                                      const filejson = {}
                                      filejson['filename'] = files[i].name;
                                      filejson['filetype'] = files[i].type;
                                      filejson['filesize'] = files[i].size;
                                      filejson['fileid'] = fileid
                                      filedata.push(filejson);
                                 }
    
                                  const data = {
                                      folderid: currentfolderid,
                                      filedata: filedata
                                  }
                                  
                                  fetch('/api/boxfiler/addfiles/' + this.props.groupid + '/' + this.props.boxfilerid + '/' + data.folderid, {
                                      method: 'POST',
                                      headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                      },
                                      body: JSON.stringify(data)
                                  }).then((res) => {
                                      return res.json();
                                  }).then((body) => {
                                      if(body.res === true) {
                                          for(let j = 0; j < files.length; j++) {
                                            firebase.storage().ref(this.props.groupid  + '/' + this.props.boxfilerid + '/' + data.folderid + '/' + files[j].name)
                                            .put(files[j]);
                                          }
                                          this.setState({
                                              addfilemodal: false
                                          })
                                      }
                                  }).catch((error) => {
                                      console.log(error);
                                  })
                              }} multiple/>
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

     Folders = () => {
        if (this.state.groupresp.length > 0) {
            return (
                <div>
                    {
                        this.state.groupresp.map(item => (
                            <div key={this.state.groupresp.indexOf(item)}>
                             <div className="folder-component-padding">
                             <div className="folder-output">
                              <div className="row">
                               <div className="col-md-10" onClick={() => {
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
                               <div className="col-md-2">
                                <div className="button-padding">
                                <button className="button-submit" onClick={() => {
                                    this.setState({
                                        addfilemodal: true,
                                        currentfoldername: item.foldername,
                                        currentfolderid: item.folderid
                                    })
                                }}>ADD FILES</button>
                                </div>
                               </div>
                              </div>
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
                                                xhr.onload = (event) => {
                                                    var blob = xhr.response;
                                                    console.log(blob)
                                                };
                                                xhr.open('GET', url);
                                                xhr.send();
                                                this.setState({
                                                    url: url,
                                                    currentfilename: index.filename,
                                                    outputfile: true,
                                                    currentfolderid: item.folderid,
                                                    currentfileid: index.fileid
                                                })
                                            }).then(() => {
                                                
                                            }).catch((error) => {
                                                console.log(error);
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
            )   
        } else {
                return (
                    <div>
                      <div className="empty-folders">
                          <h1 className="text-center">THERE ARE NO FOLDERS IN THE GROUP</h1>
                      </div>
                    </div>
                )
            }
    }

    FolderModal = ({foldermodal}) => {
        if (foldermodal === true) {
            return (
                <div>
                  <div className="modal-edu">
                    <div className="container">
                     <div className="modal-padding">
                     <div className="modal-header-white">
                     <span className="closebtnlightblue" onClick={() => {
                            this.setState({
                                foldermodal: false
                            })
                        }}>&times;</span>
                        <h3>CREATE FOLDER</h3>
                     </div>
                      <div className="modal-blue-container">
                        <div className="input-container">
                            <div className="group">      
                                <input type="text" className="inputbar-white" name="foldername" onChange={(e) => {
                                    this.setState({
                                    [e.target.name]: e.target.value
                                    })
                                }} required />
                                <span className="highlight-white"></span>
                                <span className="bar-white"></span>
                                <label className="labelbar-white">Name of Group</label>
                            </div>
                        </div>
                        <div className="input-container">
                          <div className="drop-box" onDrop={(e) => {
                              e.preventDefault();
                              const files = e.dataTransfer.files;
                              const filedata = [];
                              for (let i = 0; i < files.length; i++) {
                                  const fileid = generateId(98);
                                  const filejson = {}
                                  filejson['filename'] = files[i].name;
                                  filejson['filetype'] = files[i].type;
                                  filejson['filesize'] = files[i].size;
                                  filejson['fileid'] = fileid
                                  filedata.push(filejson);
                             }

                              const folderid = generateId(50);

                              const data = {
                                  foldername: this.state.foldername,
                                  folderid: folderid,
                                  filedata: filedata
                              }
                              
                              fetch('/api/boxfiler/createfolder/' + this.props.groupid + '/' + this.props.boxfilerid + '/' + data.folderid, {
                                  method: 'POST',
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify(data)
                              }).then((res) => {
                                  return res.json();
                              }).then((body) => {
                                  if(body.res === true) {
                                      for(let j = 0; j < files.length; j++) {
                                        firebase.storage().ref(this.props.groupid  + '/' + this.props.boxfilerid + '/' + data.folderid + '/' + files[j].name)
                                        .put(files[j]);
                                      }
                                      this.setState({
                                          foldermodal: false
                                      })

                                      this.fetchFolders();
                                  }
                              }).catch((error) => {
                                  console.log(error);
                              })
                          }} onDragOver={(e) => {
                            e.preventDefault();
                            return false
                          }} onDragLeave={(e) => {
                              e.preventDefault();
                              return false
                          }}>
                            <div className="row">
                             <div className="col-md-4">
                              <h3 className="text-center">DROP FILES HERE</h3>
                             </div>
                             <div className="col-md-4">
                              <h3 className="text-center">OR</h3>
                             </div>
                             <div className="col-md-4">
                              <input type="file" onChange={(e) => {
                                  const files = e.target.files;
                                  const filedata = [];
                                  for (let i = 0; i < files.length; i++) {
                                      const fileid = generateId(98);
                                      const filejson = {}
                                      filejson['filename'] = files[i].name;
                                      filejson['filetype'] = files[i].type;
                                      filejson['filesize'] = files[i].size;
                                      filejson['fileid'] = fileid
                                      filedata.push(filejson);
                                 }

                                  const folderid = generateId(50);

                                  const data = {
                                      foldername: this.state.foldername,
                                      folderid: folderid,
                                      filedata: filedata
                                  }
                                  
                                  fetch('/api/boxfiler/createfolder/' + this.props.groupid + '/' + this.props.boxfilerid + '/' + data.folderid, {
                                      method: 'POST',
                                      headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                      },
                                      body: JSON.stringify(data)
                                  }).then((res) => {
                                      return res.json();
                                  }).then((body) => {
                                      if(body.res === true) {
                                        for (let j = 0; j < files.length; j++) {
                                            firebase.storage().ref(this.props.groupid  + '/' + this.props.boxfilerid + '/' + data.folderid + '/' + files[j].name)
                                            .put(files[j]);
                                        }
                                          this.setState({
                                              foldermodal: false
                                          })

                                          this.fetchFolders();
                                      }
                                  }).catch((error) => {
                                      console.log(error);
                                  })

                              }} multiple/>
                             </div>
                            </div>
                          </div>
                        </div>
                      </div>
                     </div>
                    </div>
                  </div>
                </div>
            )
        } else  {
            return null;
        }
    }

    render() {
        console.log(this.state);
        return (
            <div>
             <div className="row">
              <div className="col-md-12">
                <div className="float-right">
                <button className="button-submit" onClick={() => {
                    this.setState({
                        foldermodal: true
                    })
                }}>CREATE FOLDER</button>
                </div>
                <h2>FOLDERS</h2>
              </div>
             </div>
             <LoadingBlue loading={this.state.loading}/>
             <div>
             <this.Folders/>
             </div>
             <this.FolderModal foldermodal={this.state.foldermodal}/>
             <this.AddFileModal addfilemodal={this.state.addfilemodal} currentfolderid={this.state.currentfolderid} currentfoldername={this.state.currentfoldername}/>
             <this.OutputFiler currentfilename={this.state.currentfilename} url={this.state.url} outputfile={this.state.outputfile}/>
            </div>
        )
    }
}

const BoxFiler = ({boxfiler , groupid, boxfilerid}) => {
    if (boxfiler === true) {
        return (
          <div>
             <div className="folders-container">
                 <Filer groupid={groupid} boxfilerid={boxfilerid}/>
             </div>
          </div>
        )
    } else {
        return null;
    }

}

export default BoxFiler;