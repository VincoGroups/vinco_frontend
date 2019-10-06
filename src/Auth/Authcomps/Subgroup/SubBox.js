import React from 'react';
import firebase from '../../../ServerSide/basefile';
import {generateId} from '../../../ServerSide/functions';
import FileView from '../../Authcomps/Group/BoxFiler/Fileview';

class SubBoxComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filecomment: '',
            commentres: []
        }
    }

    fetchCommentsOnFile = () => {
        setTimeout(() => {
            fetch('/api/subgroup/getcommentsonfile/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subboxid + '/' + this.props.currentfolderid + '/' + this.props.currentfileid)
            .then((res) => {
                return res.json();
            }).then((bod) => {
                this.setState({
                    commentres: bod
                })
            }).catch((error) => {
                console.log(error);
            })
        }, 500);
    }

    componentDidMount() {
        this.fetchCommentsOnFile();
    }

    MakeCommentOnSubPost = () => {
        const data = {
            comment: this.state.filecomment,
            date: new Date(),
            creator: firebase.auth().currentUser.uid,
            displayname: firebase.auth().currentUser.displayName,
            commentid: generateId(54)
        }

        fetch('/api/subgroup/commentonfile/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subboxid + '/' + this.props.currentfolderid + '/' + this.props.currentfileid, {
            method: 'PUT',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(() => {
            this.fetchCommentsOnFile();
        }).catch((error) => {
            console.log(error);
        })
    }

    OutputComments = () => {
        return (
            <div>
                {
                    this.state.commentres.map(item => (
                        <div key={this.state.commentres.indexOf(item)}>
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
        return (
            <div>
              <input type="text" className="input-comment-blue" name="filecomment" placeholder="Comment here..." onChange={(e) => {
                           this.setState({
                               [e.target.name] : e.target.value
                           })
              }} onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                      this.MakeCommentOnSubPost();
                  }
              }}/>
              <this.OutputComments/>
            </div>
        )
    }
}

class SubBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subboxres: [],
            createfolder: false,
            createfoldername: '',
            FileAddModal: false,
            addfilefoldername: '',
            currentfolderid: '',
            currentfile: [],
            currentfileurl: '',
            outputfilemodal: false,
            filecomment: ''
        }
    }

    fetchFolders = () => {
        setTimeout(() => {
            fetch('/api/subgroup/getsubfolders/'  + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subboxid )
            .then((res) => {
                return res.json();
            }).then((bod) => {
                this.setState({
                    subboxres: bod
                })
            }).catch((error) => {
                console.log(error);
            })
        }, 500);
    }

    componentDidMount() {
        this.fetchFolders();
    }

    AddSubFilesModal = ({FileAddModal}) => {
        if (FileAddModal === true) {
            return (
                <div>
                  <div className="modal-edu">
                    <div className="container">
                     <div className="modal-padding">
                     <div className="modal-blue-container">
                      <span className="closebtnwhite" onClick={() => {
                          this.setState({
                              addModal: false
                          })
                      }}>&times;</span>
                      <h3>{this.state.addfilefoldername}</h3>
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
                                  filejson['fileid'] = fileid;
                                  filedata.push(filejson);
                             }

                              const data = {
                                  folderid: this.state.currentfolderid,
                                  filedata: filedata
                              }
                              
                              fetch('/api/subgroup/addfilessubfolder/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subboxid + '/' + data.folderid, {
                                  method: 'PUT',
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify(data)
                              }).then(() => {
                                      for(let j = 0; j < files.length; j++) {
                                        firebase.storage().ref(this.props.groupid  + '/' + this.props.subid + '/' + this.props.subgroupid  + '/' + this.props.subboxid + '/' + data.folderid + '/' + files[j].name)
                                        .put(files[j]);
                                      }

                                      this.fetchFolders();
                                  
                              }).then(() => {
                                  this.setState({
                                    FileAddModal: false
                                  })
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
                                      filejson['fileid'] = fileid;
                                      filedata.push(filejson);
                                 }
    
                                  const data = {
                                      folderid: this.state.currentfolderid,
                                      filedata: filedata
                                  }
                                  
                                  fetch('/api/subgroup/addfilessubfolder/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subboxid + '/' + data.folderid, {
                                      method: 'PUT',
                                      headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                      },
                                      body: JSON.stringify(data)
                                  }).then(() => {
                                          for(let j = 0; j < files.length; j++) {
                                            firebase.storage().ref(this.props.groupid  + '/' + this.props.subid + '/' + this.props.subgroupid  + '/' + this.props.subboxid + '/' + data.folderid + '/' + files[j].name)
                                            .put(files[j]);
                                          }
                                          this.setState({
                                              FileAddModal: false
                                          })
                                                                                 
                                          this.fetchFolders();
                                      
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
        } else {
            return null;
        }
    }

    OutputFolders = () => {
        return (
            <div>
                {
                     this.state.subboxres.map(item => (
                        <div key={this.state.subboxres.indexOf(item)}>
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
                                    FileAddModal: true,
                                    addfilefoldername: item.foldername,
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
                                        firebase.storage().ref(this.props.groupid  + '/' + this.props.subid + '/' + this.props.subgroupid  + '/' + this.props.subboxid + '/' + item.folderid + '/' + index.filename)
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
                                                currentfile: index,
                                                currentfileurl: url,
                                                outputfilemodal: true,
                                                currentfolderid: item.folderid
                                            })
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
    }

    OutputFile = ({outputfilemodal}) => {
        if (outputfilemodal === true) {
            return (
                <div>
                 <div className="modal-edu-white">
                  <div className="container">
                   <div className="modal-padding">
                    <span className="closebtndark" onClick={() => {
                        this.setState({
                            outputfilemodal: false
                        })
                    }}>&times;</span>
                    <h3>{this.state.currentfile.filename}</h3>
                    <div className="input-container">
                     <div className="row">
                      <div className="col-md-4">
                       <SubBoxComments 
                       subid={this.props.subid} 
                       subgroupid={this.props.subgroupid} 
                       grouptype={this.props.grouptype} 
                       subboxid={this.props.subboxid} 
                       groupid = {this.props.groupid}
                       currentfileid={this.state.currentfile.fileid}
                       currentfolderid = {this.state.currentfolderid}
                       />
                      </div>
                      <div className="col-md-8">
                       <FileView url={this.state.currentfileurl} name={this.state.currentfile.filename} type={this.state.currentfile.filetype}/>
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

    CreateFolder = ({createfolder}) => {
        if (createfolder === true) {
            return (
                <div>
                 <div className="modal-edu">
                  <div className="container">
                    <div className="modal-padding">
                     <div className="modal-container-blue">
                      <span className="closebtnwhite" onClick={() => {
                          this.setState({
                              createfolder: false
                          })
                      }}>&times;</span>
                      <h3>CREATE FOLDER</h3>
                      <div className="input-container">
                            <div className="group">      
                                <input type="text" className="inputbar-white" name="createfoldername" onChange={(e) => {
                                    this.setState({
                                    [e.target.name]: e.target.value
                                    })
                                }} required />
                                <span className="highlight-white"></span>
                                <span className="bar-white"></span>
                                <label className="labelbar-white">Name of the Folder</label>
                            </div>
                      </div>
                      <div>
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
                                  
                                  fetch('/api/subgroup/createsubfolder/'  + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subboxid, {
                                      method: 'PUT',
                                      headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                      },
                                      body: JSON.stringify(data)
                                  }).then(() => {
                                        for (let j = 0; j < files.length; j++) {
                                            firebase.storage().ref(this.props.groupid  + '/' + this.props.subid + '/' + this.props.subgroupid  + '/' + this.props.subboxid + '/' + data.folderid + '/' + files[j].name)
                                            .put(files[j]);
                                        }         
                                        
                                        this.fetchFolders();
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
                                      foldername: this.state.createfoldername,
                                      folderid: folderid,
                                      filedata: filedata
                                  }
                                  
                                  fetch('/api/subgroup/createsubfolder/'  + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subboxid, {
                                      method: 'PUT',
                                      headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                      },
                                      body: JSON.stringify(data)
                                  }).then(() => {
                                        for (let j = 0; j < files.length; j++) {
                                            firebase.storage().ref(this.props.groupid  + '/' + this.props.subid + '/' + this.props.subgroupid  + '/' + this.props.subboxid + '/' + data.folderid + '/' + files[j].name)
                                            .put(files[j]);
                                        }                   
                                        
                                        this.fetchFolders();
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
        } else {
            return null;
        }
    }

    render() {
        console.log(this.state);
        return (
            <div>
             <div className="sub-box">
              <div className="float-right">
               <button className="button-submit-blue" onClick={() => {
                   this.setState({
                       createfolder: true
                   })
               }}>CREATE FOLDER</button>
              </div>
              <h3>{this.props.subgroupname + ' Box'}</h3>
              <div className="input-container">
               <this.OutputFolders/>
              </div>
             </div>
             <this.CreateFolder createfolder={this.state.createfolder}/>
             <this.AddSubFilesModal FileAddModal={this.state.FileAddModal}/>
             <this.OutputFile outputfilemodal={this.state.outputfilemodal}/>
            </div>
        )
    }
}

const SubShowBox = ({
    subboxshow,
    subgroupname, 
    subid,
    subgroupid,
    grouptype, 
    subboxid,
    maingroupname,
    groupid,
    }) => {
    if (subboxshow === true) {
        return (
            <div>
             <SubBox 
             subgroupname={subgroupname} 
             subid={subid} 
             subgroupid={subgroupid} 
             grouptype={grouptype} 
             subboxid={subboxid} 
             maingroupname={maingroupname} 
             groupid = {groupid}/>
            </div>
        )
    } else {
        return null;
    }
}

export default SubShowBox;