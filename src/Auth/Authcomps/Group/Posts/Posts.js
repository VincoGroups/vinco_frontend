import React from 'react';
import generateId from '../../../../ServerSide/generate';
import firebase from '../../../../ServerSide/basefile';
import setNotifications from '../../../../ServerSide/userfunctions/SetNotification';
import Loadingblue from '../../../../NonAuth/Comps/Loadingblue';

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            response: [],
            commentinput: '',
        }
    }

    _isMounted = false

   componentDidMount() {
      this._isMounted = true
      this.fetchComments();
    }

    componentWillUnmount() {
      this._isMounted = false
    }

    fetchComments = () => {
        setTimeout(() => {
        fetch('/wallpostapi/getcomments/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.wallpostid + '/' + this.props.postid)
        .then((response) => {
            return response.json();
        }).then((body) => {
            const newbod = body.sort((a, b) => new Date(a.date) - new Date(b.date));
            if (this._isMounted) {
                this.setState({
                    response: newbod
                })
            }
        }).catch((error) => {
            console.log(error);
        })
        } , 500)
      }

      ShowCommentOuptput = ({show}) => {
        if(show === true) {
            if (this.state.response.length > 0) {
                return (
                    <div>
                    {
                        this.state.response.map(item => (
                            <div key={this.state.response.indexOf(item)}>
                                <div className="comment-container">
                                <h6 className={"comment-" + this.props.style +  " d-inline-flex p-2"}>{item.displayname + ': ' + item.message}</h6>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                )
            } else {
                return (
                    <div>
                    <div className="comment-container">
                        <h6 className="text-center">THERE ARE CURRENTLY NO COMMENTS</h6>
                    </div>
                    </div>
                )
            }
        } else {
            return null;
        }
    }

    render() {
       return (
        <div>
        <div>
        <div>
         <div className="button-small-padding">
         <button className={"plain-btn-" + this.props.style} onClick={() => {
             if(this.state.show === false) {
                 this.setState({
                     show: true
                 })
             } else if (this.state.show === true) {
                 this.setState({
                     show: false
                 })
             }
         }}>Comments</button>
         </div>
         <this.ShowCommentOuptput show={this.state.show}/>
         </div>
        </div>
       <div className="input-comment-container">
         <input type="text" className={"input-comment-" + this.props.style} name="commentinput" onChange={(e) => {
             this.setState({
                 [e.target.name] : e.target.value
             })
         }} onKeyDown={(e) => {
             if (e.keyCode === 13) {
                 const commentdata = {
                     creator: firebase.auth().currentUser.uid,
                     displayname: firebase.auth().currentUser.displayName,
                     message: this.state.commentinput,
                     commentid: generateId(60),
                     date: new Date()
                 }
         
                 fetch('/wallpostapi/comment/' + this.props.grouptype + '/' + this.props.groupid + '/' + this.props.wallpostid + '/' + this.props.postid , {
                    method: 'POST',
                    headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify(commentdata)
                 }).then((res) => {
                     return res.json();
                 }).then((bod) => {
                     if(bod.response === true) {
                         this.fetchComments();
                         setNotifications("commentonpost" , firebase.auth().currentUser.uid , firebase.auth().currentUser.displayName , this.props.groupname , this.props.groupid, this.state.commentinput, null, "comment" , this.props.groupapi);
                     }
                 }).catch((error) => { 
                     console.log(error);
                 })
             }
         }} placeholder="Comment here..."/>
       </div>
       <Loadingblue loading={this.state.loading} />
      </div>
       )
    }
}

class Posts extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            post: '',
            currentuser: '',
            postsres: [],
            commentinput: '',
            show: false,
            loading: true,
            postshow: false,
            posttitle: 'PICK A TYPE OF POST',
            question: false,
            statment: false,
            currentpost: '',
            remindermodal: false,
            reminderdate: '',
            reminderpost: '',
            remindertime: '',
            remindershow: false
        }
    }

   componentDidMount() {
    this.fetchWallposts()
   }

   fetchWallposts = () => {
    setTimeout(() => {
    fetch('/wallpostapi/getposts/'+ this.props.grouptype + '/' + this.props.groupid + '/' + this.props.wallpostid)
    .then((res) => {
        return res.json();
    }).then((bod) => {
        const newbod = bod.sort((a, b) => new Date(a.date) - new Date(b.date));
        this.setState({
            postsres: newbod.reverse(),
            loading: false
        })
    }).catch((error) => {
        console.log(error);
    })
    } , 500)
   }
   
   ReminderModal = ({remindershow}) => {
        if (remindershow === true) {
            return (
                <div>
                  <div className="modal-edu">
                    <div className="container">
                     <div className="modal-padding">
                      <div className="modal-container">
                        <span className="closebtndark" onClick={() => {
                            this.setState({
                                remindershow: false
                            })
                        }}>&times;</span>
                        <h3>SET A REMINDER</h3>
                        <div className="row">
                         <div className="col-md-6">
                         <div className="input-container">
                            <div className="group">      
                            <label>Set Reminder Date.</label>
                            <input type="date" className="input-regular" name="reminderdate" onChange={(e) => {
                                this.setState({
                                [e.target.name]: e.target.value
                                })
                            }} required />
                            </div>
                         </div>
                         </div>
                         <div className="col-md-6">
                         <div className="input-container">
                            <div className="group">      
                            <label>Set Reminder Time.</label>
                            <input type="time" className="input-regular" name="remindertime" onChange={(e) => {
                                this.setState({
                                [e.target.name]: e.target.value
                                })
                            }} required />
                            </div>
                         </div>
                         </div>
                        </div>
                        <div className="input-container">
                        <div className="group">      
                          <input type="text" className="inputbar" name="reminderpost" onChange={(e) => {
                             this.setState({
                              [e.target.name]: e.target.value
                              })
                           }} required />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className="labelbar">Reminder Post.</label>
                         </div>
                        </div>
                        <div className="button-padding">
                           <button className="button-submit-blue" onClick={() => {
                               const data = {
                                   reminderid: generateId(53),
                                   reminderdate: this.state.reminderdate,
                                   reminderpost: this.state.reminderpost,
                                   remindertime: this.state.remindertime,
                                   groupname: this.props.groupname,
                                   grouptype: this.props.grouptype,
                                   groupid: this.props.groupid,
                                   creator: firebase.auth().currentUser.uid
                               }
    
                               fetch('/api/group/setreminder/' + this.props.grouptype + '/' + this.props.groupid , {
                                   method: 'PUT',
                                   headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                   },
                                   body: JSON.stringify(data)
                               }).then(() => {
                                   this.setState({
                                       remindershow: false
                                   })
                               }).catch((error) => {
                                   console.log(error);
                               })
    
                           }}>MAKE REMINDER</button>
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

   ShowPosts = () => {
       if (this.state.postsres.length > 0) {
        return(
            <div>
              <div className="posts-container">
                 {
                     this.state.postsres.map(item => (
                         <div key={this.state.postsres.indexOf(item)}>
                           <div className="post-spacing">
                             <div className="slightshadow">
                             <div className={"post-heading-" + item.posttype}>
                              <div className="row">
                               <div className="col-md-10">
                                <h6>{item.displayname + ' / ' + item.usertitle}</h6>
                               </div>
                               <div className="col-md-2">
                                 <h6>{item.displaydate}</h6>
                               </div>
                              </div>
                             </div>
                             <div className={"post-" + item.posttype}>  
                                 <h4>{item.message}</h4>
                             </div>
                             <div className={"post-options-" + item.posttype}>
                               <Comments grouptype={this.props.grouptype} groupapi={this.props.groupapi} style={item.posttype} groupname = {this.props.groupname} groupid={this.props.groupid} postid ={item.postid} wallpostid={this.props.wallpostid}/>
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
                 <div className="empty-container">
                    <h2 className="text-center">THERE ARE NO POSTS</h2>
                 </div>
               </div>
           )
       }
   }

    MakePost = () => {
        const date = new Date();
        const data = {
            creator: firebase.auth().currentUser.uid,
            displayname: firebase.auth().currentUser.displayName,
            postid: generateId(67),
            message: this.state.post,
            date: new Date(),
            posttype: this.state.currentpost,
            displaydate: date.getMonth().toString() + '/' + date.getDate() + '/' + date.getFullYear(),
            usertitle: this.props.usertitle
        }

        fetch('/wallpostapi/makepost/'+ this.props.grouptype + '/' + this.props.groupid + '/' + this.props.wallpostid, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            this.fetchWallposts();
            this.setState({
                postshow: false
            })

            if (this.state.currentpost === "question") {
                setNotifications("createpostquestion" , firebase.auth().currentUser.uid, firebase.auth().currentUser.displayName, this.props.groupname, this.props.groupid , this.state.post, null, "post" , this.props.groupapi);
            } else if (this.state.currentpost === "statement") {
                setNotifications("createpoststatement" , firebase.auth().currentUser.uid, firebase.auth().currentUser.displayName, this.props.groupname, this.props.groupid , this.state.post, null, "post" , this.props.groupapi);
            }

        }).catch((error) => {
            console.log(error);
        })
    }

    PostModal = ({postshow}) => {
        if (postshow === true) {
            return (
                <div>
                    <div className="modal-edu">
                     <div className="container">
                      <div className="modal-padding">
                         <div className="modal-header-white">
                           <span className="closebtndark" onClick={() => {
                               this.setState({
                                   postshow: false
                               })
                           }}>&times;</span>
                           <h3>CREATE A POST</h3>
                         </div>
                         <div className="modal-container">
                         <div className="float-right">
                           <div className="row">
                           <div className="col-xs-6">
                             <div className="button-total-padding">
                             <button className="button-submit" onClick={() => {
                                 this.setState({
                                     statment: false,
                                     question: true,
                                     posttitle: 'QUESTION',
                                     currentpost:'question'
                                 })
                             }}>QUESTION</button>
                             </div>
                           </div>
                           <div className="col-xs-6">
                            <div className="button-total-padding">
                            <button className="button-submit-blue" onClick={() => {
                                this.setState({
                                    question: false,
                                    statment: true,
                                    posttitle: "STATEMENT",
                                    currentpost: "statement"
                                })
                            }}>STATEMENT</button>
                            </div>
                           </div>
                           </div>
                         </div>
                         <h3>{this.state.posttitle}</h3>
                         <div className="input-container">
                            <div className="group">      
                                <input type="text" className="inputbar" name="post" onChange={(e) => {
                                    this.setState({
                                    [e.target.name]: e.target.value
                                    })
                                }} onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        this.MakePost();
                                    }
                                }} required />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className="labelbar">Ask a question to your group or make a statment.</label>
                            </div>
                         </div>
                         <div className="input-container">
                          <div className={"post-heading-" + this.state.currentpost}>
                            <div className="row">
                             <div className="col-md-10">
                              <h6>{firebase.auth().currentUser.displayName + ' / ' + this.props.usertitle}</h6>
                             </div>
                             <div>
                              <h6>{new Date().getMonth().toString() + '/' + new Date().getDate() + '/' + new Date().getFullYear()}</h6> 
                             </div>
                            </div>
                            <div className={"post-" + this.state.currentpost}>
                              <h4>{this.state.post}</h4>
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
        return (
            <div>
             <div className="mainchat-component">
              <div className="row">
                <div className="col-md-3">
                <h2>POSTS</h2>
                </div>
                <div className="col-md-6">
                    <div className="d-flex justify-content-center">
                        <div className="sub-comp">
                        <div className="d-flex justify-content-center">
                        <div className="question-box"></div> 
                        </div>
                        <h6 className="text-center">QUESTIONS</h6>
                        </div>
                        <div className="sub-comp">
                        <div className="d-flex justify-content-center">
                        <div className="statement-box"></div> 
                        </div>
                        <h6 className="text-center">STATEMENTS</h6>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                 <div className="row">
                  <div className="col-md-6">
                  <div className="button-padding">
                    <button className="button-submit-blue" onClick={() => {
                            this.setState({
                                postshow: true
                            })
                        }}>CREATE A POST</button>
                    </div>
                  </div>
                  <div className="col-md-6">
                  <div className="button-padding">
                    <button className="button-submit" onClick={() => {
                            this.setState({
                                remindershow: true
                            })
                        }}>CREATE REMINDER</button>
                   </div>
                  </div>
                 </div>
                </div>
              </div>
              <this.ShowPosts/>
              <Loadingblue loading={this.state.loading}/>
             </div>
             <this.PostModal postshow={this.state.postshow}/>
             <this.ReminderModal remindershow={this.state.remindershow}/>
            </div>
        )
    }
}

const PostsShow = ({mainchat , grouptype ,groupname, groupid , wallpostid , groupapi, usertitle}) => {
    if (mainchat === true) {
        return (
            <div>
              <div className="group-page">
              <div className="container">
                <Posts grouptype={grouptype} groupapi={groupapi} groupname={groupname} groupid={groupid} wallpostid={wallpostid} usertitle={usertitle} />
              </div>
              </div>
            </div>
        )
    } else {
        return null;
    }
}

export default PostsShow;