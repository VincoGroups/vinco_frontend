import React from 'react'

const LoadingModalPage = ({loading , content}) => {
    if (loading === true) {
        return (
            <div>
                <div className="modal-edu">
                 <div className="container">
                  <div className="modal-padding">
                    <div className="modal-container">
                      <div className="modal-loading-page">
                        <div className="d-flex justify-content-center">
                            <div className="loadingblue"></div>
                        </div>
                        <div className="loading-title-padding">
                        <h1 className="text-center">{content}</h1>
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

export default LoadingModalPage;