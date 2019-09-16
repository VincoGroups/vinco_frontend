import React from 'react';
import generateId from '../../../../ServerSide/generate';
import firebase from '../../../../ServerSide/basefile';

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            response: []
        }
    }

   async componentDidMount() {
     await this.fetchComments();
    }

    fetchComments = () => {
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
                                <h6 className="comment d-inline-flex p-2">{item.displayname + ': ' + item.message}</h6>
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
         <button className="plain-btn" onClick={() => {
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
         <this.ShowCommentOuptput show={this.state.show}/>
         </div>
        </div>
       <div className="input-comment-container">
         <input type="text" className="input-comment" name="commentinput" onChange={(e) => {
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
                     }
                 }).catch((error) => {
                     console.log(error);
                 })
             }
         }} placeholder="Comment here..."/>
       </div>
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
            response: '',
            show: false
        }
    }

  async componentDidMount() {
    await this.fetchWallposts();
   }

   fetchWallposts = () => {
    fetch('/wallpostapi/getposts/' + this.props.groupid + '/' + this.props.wallpostid)
    .then((res) => {
        return res.json();
    }).then((bod) => {
        const newbod = bod.sort((a, b) => new Date(a.date) - new Date(b.date));
        this.setState({
            postsres: newbod.reverse()
        })
    }).catch((error) => {
        console.log(error);
    })
   }

   ShowPosts = () => {
       return(
           <div>
             <div className="posts-container">
                {
                    this.state.postsres.map(item => (
                        <div key={this.state.postsres.indexOf(item)}>
                          <div className="post-spacing">
                            <div className="slightshadow">
                            <div className="post-heading">
                             <div className="row">
                              <div className="col-md-10">
                               <h6>{item.displayname}</h6>
                              </div>
                              <div className="">
                                <h6>{item.displaydate}</h6>
                              </div>
                             </div>
                            </div>
                            <div className="post">  
                                <h4>{item.message}</h4>
                            </div>
                            <div className="post-options">
                              <Comments groupid={this.props.groupid} postid ={item.postid} wallpostid={this.props.wallpostid}/>
                            </div>
                            </div>
                          </div>
                        </div>
                    ))
                }
             </div>
           </div>
       )
   }

    MakePost = () => {
        const date = new Date();
        const data = {
            creator: firebase.auth().currentUser.uid,
            displayname: firebase.auth().currentUser.displayName,
            postid: generateId(67),
            message: this.state.post,
            date: new Date(),
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
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <div>
             <div className="mainchat-component">
              <h2>POSTS</h2>
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
              <this.ShowPosts/>
             </div>
            </div>
        )
    }
}

const Mainchat = ({mainchat , mainchatname, groupid , wallpostid}) => {
    if (mainchat === true) {
        return (
            <div>
              <div className="mainchat-page">
              <div className="container">
                <MainChatComponent groupid={groupid} wallpostid={wallpostid}/>
              </div>
              </div>
            </div>
        )
    } else {
        return null;
    }
}

export default Mainchat;