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

    componentDidMount() {
      this.fetchComments();
    }

    fetchComments = () => {
        setTimeout(() => {
        fetch('/wallpostapi/getcomments/' + this.props.groupid + '/' + this.props.wallpostid + '/' + this.props.postid)
        .then((response) => {
            return response.json();
        }).then((body) => {
            const newbod = body.sort((a, b) => new Date(a.date) - new Date(b.date));
            this.setState({
                response: newbod
            })
        }).catch((error) => {
            console.log(error);
        })
        } , 400)
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
         
                 fetch('/wallpostapi/comment/' + this.props.groupid + '/' + this.props.wallpostid + '/' + this.props.postid , {
                    method: 'POST',
                    headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify(commentdata)
                 }).then((res) => {
                     return res.json();
                 }).then((bod) => {
                     console.log(bod);
                     if(bod.response === true) {
                         this.fetchComments();
                         setNotifications("commentonpost" , firebase.auth().currentUser.uid , firebase.auth().currentUser.displayName , this.props.groupname , this.props.groupid, this.state.commentinput);
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

class MainChatComponent extends React.Component{
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
            currentpost: ''
        }
    }

   componentDidMount() {
    this.fetchWallposts()
   }

   fetchWallposts = () => {
    setTimeout(() => {
    fetch('/wallpostapi/getposts/' + this.props.groupid + '/' + this.props.wallpostid)
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
                                <h6>{item.displayname}</h6>
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
                               <Comments style={item.posttype} groupname = {this.props.groupname} groupid={this.props.groupid} postid ={item.postid} wallpostid={this.props.wallpostid}/>
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
        }

        fetch('/wallpostapi/makepost/' + this.props.groupid + '/' + this.props.wallpostid, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            this.fetchWallposts();
            setNotifications("createpost" , firebase.auth().currentUser.uid, firebase.auth().currentUser.displayName, this.props.groupname, this.props.groupid , this.state.post);
            this.setState({
                postshow: false
            })

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
             <div className="mainchat-component">
              <div className="row">
                <div className="col-md-2">
                <h2>POSTS</h2>
                </div>
                <div className="col-md-8">
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
                <div className="col-md-2">
                <div className="float-right">
                    <button className="button-submit-blue" onClick={() => {
                        this.setState({
                            postshow: true
                        })
                    }}>CREATE A POST</button>
                </div>
                </div>
              </div>
              <this.ShowPosts/>
              <Loadingblue loading={this.state.loading}/>
             </div>
             <this.PostModal postshow={this.state.postshow}/>
            </div>
        )
    }
}

const Mainchat = ({mainchat , groupname, groupid , wallpostid}) => {
    if (mainchat === true) {
        return (
            <div>
              <div className="mainchat-page">
              <div className="container">
                <MainChatComponent groupname={groupname} groupid={groupid} wallpostid={wallpostid}/>
              </div>
              </div>
            </div>
        )
    } else {
        return null;
    }
}

export default Mainchat;