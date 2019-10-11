import React, {useEffect, useState, useRef} from 'react';

const ConnectionPosts = ({connectionposts}) => {

    const ReminderModal = () => {
        const [remindermodal, setReminderModal] = useState({
            remindermodal: false
        })
        const ReturnReminderModal = ({remindermodal}) => {
          if (remindermodal === true) {
            return (
                <div>
                  <div className="modal-edu">
                    <div className="container">
                      <div className="modal-padding">
                        <div className="modal-container-blue">
                         <span className="closebtn"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )
          } else {
              return null
          }
        }
    }

    const PostModal = () => {
        const [postmodal, setPostModal] = useState({
            postmodal: false
        })
        
        const ReturnPostModal = ({postmodal}) => {
            if (postmodal === true) {
                return(
                    <div>
                      <div className="modal-edu">
                        <div className="container">
                         <div className="modal-padding">
                          <div className="modal-container">
                            <span className="closebtndark" onClick={() => {
                                setPostModal({
                                    postmodal: false
                                })
                            }}>&times;</span>
                          </div>
                         </div>
                        </div>
                      </div>
                    </div>
                )
            } else {
                return null
            }
        }

        return (
         <div>
          <button className="button-submit" onClick={() => {
              setPostModal({
                  postmodal: true
              })
          }}>MAKE POST</button>
          <ReturnPostModal postmodal={postmodal.postmodal}/>
         </div>
        )
    }

    if (connectionposts === true) {
        return (
            <div className="connection-page-component">
             <div className="connection-posts">
              <div className="container">
               <div className="row">
                <div className="col-md-8">
                 <h4>POSTS</h4>
                </div>
                <div className="col-md-4">
                 <div className="row">
                  <div className="col-md-6">
                    <PostModal/>
                  </div>
                  <div className="col-md-6">
                    <button className="button-submit-blue">MAKE REMINDER</button>
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