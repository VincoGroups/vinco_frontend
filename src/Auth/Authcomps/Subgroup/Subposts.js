import React from 'react';
import firebase from '../../../ServerSide/basefile';
import {generateId} from '../../../ServerSide/functions';

class SubPostsComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentsres: [],
            comment: '',
            showcomments: false
        }
    }

    fetchComments = () => {
        setTimeout(() => {
          fetch('/api/subgroup/getpostcomments/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subpostid + '/' + this.props.postid )
          .then((res) => {
              return res.json();
          }).then((body) => {
              this.setState({
                  commentsres: body
              })
          }).catch((error) => {
              console.log(error);
          })
        }, 500);
    }

    componentDidMount() {
        this.fetchComments();
    }

    Comments = ({showcomments}) => {
        if (showcomments === true) {
            if (this.state.commentsres.length > 0) { 
                return (
                    <div>
                        {this.state.commentsres.map((item) => (
                            <div key={this.state.commentsres.indexOf(item)}>
                             <div className="comment-container">
                               <h6 className="comment d-inline-flex p-2">{item.displayname + ': ' + item.message}</h6>
                             </div>
                            </div>
                        ))}
                    </div>
                )
            } else {
                return (
                    <div>
                     <h5 className="text-center">THERE ARE NO COMMENTS</h5>
                    </div>
                )
            }
        } else {
            return null;
        }
    }
    
    MakeComment = () => {
        const data = {
            date: new Date(),
            message: this.state.comment,
            displayname: firebase.auth().currentUser.displayName,
            commentid: generateId(40),
            creator: firebase.auth().currentUser.uid
        }

        fetch('/api/subgroup/postcommentonpost/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subpostid + '/' + this.props.postid,{
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


    render() {
        console.log(this.state);
        return (
            <div>
              <div className="button-padding">
               <button className="plain-btn" onClick={() => {
                   if (this.state.showcomments === true) {
                       this.setState({
                           showcomments: false
                       })
                   } else if (this.state.showcomments === false) {
                    this.setState({
                        showcomments: true
                    })
                   }
               }}>COMMENTS</button>
              </div>
              <this.Comments showcomments={this.state.showcomments}/>
              <input type="text" className="input-comment-sub" name="comment" placeholder="Comment here..." onChange={(e) => {
                  this.setState({
                      [e.target.name]: e.target.value
                  })
              }} onKeyDown={(e) => {
                 if (e.keyCode === 13) {
                    this.MakeComment()
                 }
              }}/>
            </div>
        )
    }
}

class Subposts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subpostres: [],
            createpostmodal: false,
            subpostinput: '',
            subinputfile: '',
            maingroupfolder: false,
            mainboxres: [],
            fileurl: '',
            filename: '',
            postmodal: false,
            currentpost: []
        }
    }

    fetchSubPosts = () => {
      setTimeout(() => {
          fetch('/api/subgroup/getsubposts/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subpostid)
          .then((res) => {
              return res.json();
          }).then((bod) => {
              this.setState({
                  subpostres: bod
              })
          }).catch((error) => {
              console.log(error);
          })
      }, 500);
    }

    componentDidMount() {
      this.fetchSubPosts();
      setTimeout(() => {
        fetch('/api/boxfiler/getfolders/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.groupboxfilerid)
        .then((res) => {
            return res.json();
        }).then((bod) => {
            this.setState({
                mainboxres: bod
            })
        }).catch((error) => {
            console.log(error);
        })
      }, 500);  
    }

    MainGroupFolderSelect = ({maingroupfolder}) => {
        if (maingroupfolder === true) {
            return (
                <div>
                 <div className="modal-edu">
                  <div className="container">
                   <div className="modal-padding">
                    <div className="modal-container">
                     <span className="closebtndark" onClick={() => {
                         this.setState({
                             maingroupfolder: false
                         })
                     }} >&times;</span>
                     <h3>{this.props.maingroupname}</h3>
                     <div className="input-container">
                     <div>
                        {
                            this.state.mainboxres.map(item => (
                                <div key={this.state.mainboxres.indexOf(item)}>
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
                                                firebase.storage().ref(this.props.groupid + '/' + this.props.groupboxfilerid + '/' + item.folderid + '/' + index.filename)
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
                                                        fileurl: url,
                                                        filename: index.filename,
                                                        maingroupfolder: false
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

    CreatePostSub = ({createpostmodal}) => {
        if (createpostmodal === true) {
           return (
               <div>
                   <div className="modal-edu">
                    <div className="container">
                     <div className="modal-padding">
                     <div className="modal-container">
                      <span className="closebtndark" onClick={() => {
                          this.setState({
                              createpostmodal: false
                          })
                      }}>&times;</span>
                      <h3>CREATE POST</h3>
                      <div className="input-container">
                        <div className="post-text-container slightshadow">
                            <textarea className="post-white-text-area" placeholder="Make a post" name="subpostinput" onChange={(e) => {
                            this.setState({
                                [e.target.name]: e.target.value
                            })
                            }} />
                            <div className="post-option-buttons-container">
                            <div className="row">
                            <div className="col-md-3">
                                <button className="plain-btn-statement">ATTACH FILE</button>
                            </div>
                            <div className="col-md-3">
                                <div className="justify-content-center">
                                <button className="plain-btn-statement">CHOOSE FILE FROM SUBFOLDER</button>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="justify-content-center">
                                <button className="plain-btn-statement" onClick={() => {
                                    this.setState({
                                        maingroupfolder: true
                                    })
                                }}>{`CHOOSE FILE FROM ${this.props.maingroupname}`}</button>
                                </div>
                            </div>
                            <div className="col-md-3">
                            <button className="button-submit-blue" onClick={() => {
                               
                                const data = {
                                message: this.state.subpostinput,
                                file: this.state.fileurl,
                                postid: generateId(79),
                                creator: firebase.auth().currentUser.uid,
                                displayName: firebase.auth().currentUser.displayName,
                                date: new Date().getMonth() + '/' + new Date().getDate() + '/' + new Date().getFullYear()  + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
                                servertimestamp: new Date(),
                                filename: this.state.filename
                                }

                                
                                fetch('/api/subgroup/makepost/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.subid + '/' + this.props.subgroupid + '/' + this.props.subpostid, {
                                method: 'PUT',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                                }).then(() => {
                                 this.fetchSubPosts();
                                 this.setState({
                                     createpostmodal: false
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
                            <h6>{"ATTACHED: " + this.state.filename}</h6>
                            <div className="input-container">
                            <h4>{this.state.subpostinput}</h4>
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

    Output = () => {
        return (
            <div>
                {
                    this.state.subpostres.map((item) => (
                        <div key={this.state.subpostres.indexOf(item)}>
                           <div className="post-spacing">
                             <div className="slightshadow">
                              <div className="sub-post" onClick={() => {
                                  this.setState({
                                    postmodal: true,
                                    currentpost: item
                                  })
                              }}>
                              <div className="post-header">
                              <div className="row">
                               <div className="col-md-10">
                                <h6>{item.displayName}</h6>
                               </div>
                               <div className="col-md-2">
                                 <h6>{item.date}</h6>
                               </div>
                              </div>
                             </div>
                             <div className="post-message">  
                                <h4>{item.message}</h4>
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

    PostModal = ({postmodal}) => {
      if (postmodal === true) {
        return (
            <div>
              <div className="modal-edu">
                <div className="container">
                 <div className="modal-padding">
                  <div className="modal-container-color-blue">
                   <span className="closebtndark" onClick={() => {
                       this.setState({
                           postmodal: false
                       })
                   }}>&times;</span>
                   <h6>{this.state.currentpost.displayName}</h6>
                   <div className="title-padding">
                    <h3>{this.state.currentpost.message}</h3>
                   </div>
                   <SubPostsComments grouptype={this.props.grouptype} groupid={this.props.groupid} subid={this.props.subid} subgroupid={this.props.subgroupid} subpostid={this.props.subpostid} postid={this.state.currentpost.postid} />
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
              <div className="subpost-page">
                <div className="float-right">
                 <button className="button-submit-blue" onClick={() => {
                     this.setState({
                         createpostmodal: true
                     })
                 }}>CREATE POST</button>
                </div>
                <h3>{this.props.subgroupname + " Posts"}</h3>
                <div className="input-container">
                 <this.Output/>
                </div>
              </div>
              <this.PostModal postmodal={this.state.postmodal}/>
              <this.CreatePostSub createpostmodal={this.state.createpostmodal}/>
              <this.MainGroupFolderSelect maingroupfolder={this.state.maingroupfolder}/>
            </div>
        )
    }
}

const SubPostShow = ({subposts
     , subgroupname,
      groupid, 
      grouptype ,
      boxfilerid , 
      maingroupname , 
      subgroupid , 
      subid,
      subpostid}) => {
    if (subposts === true) {
        return (
            <div>
                <Subposts 
                 groupboxfilerid={boxfilerid}
                 groupid={groupid} 
                 grouptype={grouptype}  
                 subgroupname={subgroupname} 
                 maingroupname={maingroupname}
                 subgroupid = {subgroupid}
                 subid = {subid}
                 subpostid = {subpostid}
                 />
            </div>
        )
    } else {
        return null
    }
}

export default SubPostShow