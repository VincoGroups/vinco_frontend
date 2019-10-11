import React, {useState, useEffect, useRef, useCallback} from 'react';
import firebase from '../../../../ServerSide/basefile';
import Loadingblue from '../../../../Comps/Loadingblue';



const Posts = ({visible, grouptype, groupid, wallpostid }) => {
 //states
    const [postres, setPostRes] = useState({
        postres: []
    })
    const [loading, setLoading] = useState({
        loading: true
    })
    const [modalpost, setModalPost] = useState({
        modalpost: false
    })
    const [currentpost, setCurrentPost] = useState({
        currentpost: {}
    })

   const componentMounted = useRef(null);

       useEffect(() => {
        componentMounted.current = true;
           if (visible === true) {
            if (componentMounted.current) {
              fetch('/wallpostapi/getposts/'+ grouptype + '/' + groupid + '/' + wallpostid)
              .then((res) => {
                return res.json();
              }).then((bod) => {
               const newbod = bod.sort((a, b) => new Date(a.date) - new Date(b.date));
                setPostRes({
                  postres: newbod.reverse()
                })
                setLoading({
                  loading: false
                })
              }).catch((error) => {
                  console.log(error);
              })
            }
           }

           return () => {componentMounted.current = false}
       }, [visible, groupid, grouptype, wallpostid])

       const ModalPost = ({showmodalpost, post}) => {
        const [show , setShow] = useState({
            show: false
        }) 
        const [response, setResponse] = useState({
            response: []
        })
        const [commentinput, setCommentInput] = useState({
            commentinput: ''
        })
     
        const componentMounted = useRef(null);
     
        const fetchComments = useCallback(async () => {
         await fetch('/wallpostapi/getcomments/' + grouptype + '/' + groupid + '/' + wallpostid+ '/' + post.postid)
         .then((response) => {
             return response.json();
         }).then((body) => {
             const newbod = body.sort((a, b) => new Date(a.date) - new Date(b.date));
              setResponse({
               response: newbod
              })
         }).catch((error) => {
             console.log(error);
         })
       }, [post.postid])
     
        useEffect(() => {
         componentMounted.current = true;
         if (componentMounted.current) {
             fetchComments();
         }
         return () => {componentMounted.current = false}
        }, [fetchComments])
     
         const ShowCommentOuptput = () => {
                 if (response.response.length > 0) {
                     return (
                         <div>
                         {
                             response.response.map(item => (
                                 <div key={response.response.indexOf(item)}>
                                     <div className="comment-container">
                                     <h6 className={"comment-" + post.posttype +  " d-inline-flex p-2"}>{item.displayname + ': ' + item.message}</h6>
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
             } 
         
            if (showmodalpost === true) {
             return (
                 <div>
                  <div className="modal-edu">
                         <div className="container">
                          <div className="modal-padding">
                           <div className={"modal-container-" + post.posttype}>
                            <div className="row">
                             <div className="col-md-12">
                              <span className={"closebtn-" + post.posttype} onClick={() => {
                                  setModalPost({
                                      modalpost: false
                                  })
                              }}>&times;</span>
                             </div>
                            </div>
                             <div className="float-right">
                              <h6>{post.displaydate}</h6>
                             </div>
                             <h6>{post.displayname}</h6>
                             <div className="title-padding">
                             <h4>{post.message}</h4>
                             </div>
                             <div className="button-small-padding">
                             <button className={"plain-btn-" + post.posttype} onClick={() => {
                                 if(show.show === false) {
                                     setShow({
                                         show: true
                                     })
                                 } else if (show.show === true) {
                                     setShow({
                                         show: false
                                     })
                                 }
                             }}>Comments</button>
                             </div>
                             <div className="input-comment-container">
                             <input type="text" className={"input-comment-" + post.posttype} name="commentinput" onChange={(e) => {
                                 setCommentInput({
                                     commentinput: e.target.value
                                 })
                             }} onKeyDown={(e) => {
                                 if (e.keyCode === 13) {
                                     const commentdata = {
                                         creator: firebase.auth().currentUser.uid,
                                         displayname: firebase.auth().currentUser.displayName,
                                         message: commentinput.commentinput,
                                         date: new Date()
                                     }
                             
                                     fetch('/wallpostapi/comment/' + grouptype + '/' + groupid + '/' + wallpostid + '/' + post.postid , {
                                         method: 'POST',
                                         headers: {
                                         'Accept': 'application/json',
                                         'Content-Type': 'application/json'
                                         }, 
                                         body: JSON.stringify(commentdata)
                                     }).then((res) => {
                                         return res.json();
                                     }).then((bod) => {
                                         response.response.push(bod);
                                         setResponse({
                                             response: response.response
                                         })
                                     }).catch((error) => { 
                                         console.log(error);
                                     })
                                 }
                             }} placeholder="Comment here..."/>
                         </div>
                         <div className="comment-total-container">
                         <ShowCommentOuptput/>
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
   
      const ReminderModal = () => {
        const [reminderform, setReminderForm] = useState({
            reminderform: false
        })
        const ReminderForm = ({reminderform}) => {
            const [reminderdate, setReminderDate] = useState({
                reminderdate: ''
            })
            const [remindertime, setReminderTime] = useState({
                remindertime: ''
            })
            const [reminderpost, setReminderPost] = useState({
                reminderpost: ''
            })
            if (reminderform === true) {
                return (
                    <div>
                      <div className="modal-edu">
                        <div className="container">
                         <div className="modal-padding">
                          <div className="modal-container">
                            <span className="closebtndark" onClick={() => {
                                setReminderForm({
                                    reminderform: false
                                })
                            }}>&times;</span>
                            <h3>SET A REMINDER</h3>
                            <div className="row">
                             <div className="col-md-6">
                             <div className="input-container">
                                <div className="group">      
                                <label>Set Reminder Date.</label>
                                <input type="date" className="input-regular" name="reminderdate" onChange={(e) => {
                                    setReminderDate({
                                     reminderdate: e.target.value
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
                                    setReminderTime({
                                     remindertime: e.target.value
                                    })
                                }} required />
                                </div>
                             </div>
                             </div>
                            </div>
                            <div className="input-container">
                            <div className="group">      
                              <input type="text" className="inputbar" name="reminderpost" onChange={(e) => {
                                 setReminderPost({
                                  reminderpost: e.target.value
                                })
                               }} required />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className="labelbar">Reminder Post.</label>
                             </div>
                            </div>
                            <div className="button-padding">
                               <button className="button-submit-blue" onClick={() => {
                                const timedisplay = (time) => {
                                    let timesplit = time.split(':');
                                    let hours;
                                    
                                    hours = timesplit[0];
                                   let minutes = timesplit[1];
                                   let meridian = null;
                                    if (hours > 12) {
                                        meridian = 'PM';
                                        hours -= 12;
                                    } else if (hours < 12) {
                                        meridian = 'AM'
                                        if (hours === 0) {
                                            hours = 12
                                        }
                                    } else { 
                                        meridian = 'PM'
                                    }
    
                                    return hours + ':' + minutes + ' ' + meridian 
                                }
    
                                const getMonthAndDate = (date) => {
                                    const montharray = [{
                                        month: 'Jan',
                                        index: 1
                                    }, {
                                        month: 'Feb',
                                        index: 2
                                    }, {
                                        month: 'Mar',
                                        index: 3
                                    }, {
                                        month: 'Apr',
                                        index: 4
                                    }, {
                                        month: 'May',
                                        index: 5
                                    }, {
                                        month: 'Jun',
                                        index: 6
                                    }, {
                                        month: 'Jul',
                                        index: 7
                                    }, {
                                        month: 'Aug',
                                        index: 8
                                    }, {
                                        month: 'Sep',
                                        index: 9
                                    }, {
                                        month: 'Oct',
                                        index: 10
                                    }, {
                                        month: 'Nov',
                                        index: 11
                                    }, {
                                        month: 'Dec',
                                        index: 12
                                    }]
                                    const month = date.substring(5,7);
                                    let monthtitle;
                                    for (let i = 0; i < montharray.length; i++) {
                                        if (montharray[i].index === Number(month)) {
                                            return montharray[i].month + ' ' + date.substring(8) 
                                        }
                                    }
    
                                    return monthtitle + ' ' + date.substring(8)
                                }
    
                                   const data = {
                                       reminderpost: reminderpost.reminderpost,
                                       postremindertime: getMonthAndDate(reminderdate.reminderdate) + ' ' + timedisplay(this.state.remindertime) ,
                                       creator: firebase.auth().currentUser.uid,
                                       backenddate: reminderdate.reminderdate + ' ' + remindertime.remindertime,
                                       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                                   }
            
                                   
                                   fetch('/api/reminders/makeremindermain/' + grouptype + '/' + groupid , {
                                       method: 'PUT',
                                       headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                       },
                                       body: JSON.stringify(data)
                                   }).then(() => {
                                       setReminderForm({
                                           reminderform: false
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

        return (
            <div>
            <div className="button-padding">
             <button className="button-submit-blue" onClick={() => {
               setReminderForm({
                   reminderform: true
               })
             }}>CREATE A POST</button>
            <ReminderForm reminderform={reminderform.reminderform}/>
            </div>
            </div>
        )
   }

  const ShowPosts = () => {
     if (postres.postres.length > 0) {
        return(
            <div>
              <div className="posts-container">
                 {
                     postres.postres.map(item => (
                         <div key={postres.postres.indexOf(item)}>
                           <div className="post-spacing">
                             <div className="slightshadow" onClick={() => {
                                 setCurrentPost({
                                     currentpost: item
                                 })
                                 setModalPost({
                                     modalpost: true
                                 })
                             }}>
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
                 <div className="title-padding">
                 <h1 className="text-center">THERE ARE NOT POSTS SO FAR</h1>
                 </div>
             </div>
         )
     }
   }
           

  const PostModal = () => {
      const [postshow, setPostShow] = useState({
          postshow: false
      })
      const PostForm = ({postshow}) => {
          const [posttitle, setPostTitle] = useState({
            postitle: 'STATEMENT'
          })
          const [currentpost, setCurrentPost] = useState({
              currentpost: 'statement'
          })
          const [post, setPost] = useState({
            post: ''
          })

        if (postshow === true) {
            return (
                <div>
                    <div className="modal-edu">
                     <div className="container">
                      <div className="modal-padding">
                         <div className="modal-header-white">
                           <span className="closebtndark" onClick={() => {
                               setPostShow({
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
                                 setPostTitle({
                                     postitle: 'QUESTION'
                                 })
                                 setCurrentPost({
                                     currentpost: 'question'
                                 })
                             }}>QUESTION</button>
                             </div>
                           </div>
                           <div className="col-xs-6">
                            <div className="button-total-padding">
                            <button className="button-submit-blue" onClick={() => {
                                setPostTitle({
                                    postitle: 'STATEMENT'
                                })
                                setCurrentPost({
                                    currentpost: 'statement'
                                })
                            }}>STATEMENT</button>
                            </div>
                           </div>
                           </div>
                         </div>
                         <h3>{posttitle.postitle}</h3>
                         <div className="input-container">
                            <div className="group">      
                                <input type="text" className="inputbar" name="post" onChange={(e) => {
                                    setPost({
                                    post: e.target.value
                                    })
                                }} onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        const date = new Date();
                                        const data = {
                                            creator: firebase.auth().currentUser.uid,
                                            displayname: firebase.auth().currentUser.displayName,
                                            message: post.post,
                                            date: new Date(),
                                            posttype: currentpost.currentpost,
                                            displaydate: date.getMonth().toString() + '/' + date.getDate() + '/' + date.getFullYear(),
                                        }
                                
                                        fetch('/wallpostapi/makepost/'+ grouptype + '/' + groupid + '/' + wallpostid, {
                                            method: 'POST',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(data)
                                        }).then((res) => {
                                            return res.json();
                                        })
                                        .then((body) => {
                                            console.log(body)
                                            postres.postres.push(body);
                                            setPostRes({
                                                postres: postres.postres
                                            })

                                        }).catch((error) => {
                                            console.log(error);
                                        })
                                    }
                                }} required />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className="labelbar">Ask a question to your group or make a statment.</label>
                            </div>
                         </div>
                         <div className="input-container">
                          <div className={"post-heading-" + currentpost.currentpost}>
                            <div className="row">
                             <div className="col-md-10">
                              <h6>{firebase.auth().currentUser.displayName}</h6>
                             </div>
                             <div>
                              <h6>{new Date().getMonth().toString() + '/' + new Date().getDate() + '/' + new Date().getFullYear()}</h6> 
                             </div>
                            </div>
                            <div className={"post-" + currentpost.currentpost}>
                              <h4>{post.post}</h4>
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
             <button className="button-submit-blue" onClick={() => {
               setPostShow({
                   postshow: true
               })
             }}>CREATE A POST</button>
            <PostForm postshow={postshow.postshow}/>
            </div>
        </div>
      )

    }
    
    if(visible === true) {
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
                  <PostModal/>
                  </div>
                  <div className="col-md-6">
                  <ReminderModal/>
                  </div>
                 </div>
                </div>
              </div>
              <ShowPosts/>
              <Loadingblue loading={loading.loading}/>
             </div>
             <ModalPost showmodalpost={modalpost.modalpost} post={currentpost.currentpost}/>
            </div>
        )
    } else {
        return null;
    }
}

export default Posts;