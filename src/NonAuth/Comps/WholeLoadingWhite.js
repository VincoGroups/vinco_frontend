import React from 'react'

const LoadingUserPage = ({loading , username}) => {
    if (loading === true) {
        return (
            <div>
                <div className="modal-edu-white-total">
                  <div className="container">
                  <div className="d-flex justify-content-center">
                    <div className="loadingwhite"></div>
                    <h1 className="text-center">{"Loading content for " + username}</h1>
                   </div>
                  </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default LoadingUserPage