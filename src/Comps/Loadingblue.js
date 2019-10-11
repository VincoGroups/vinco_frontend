import React from 'react';
import '../App.css'

const LoadingBlue = ({loading , statement}) => {
    if(loading === true) {
        return (
            <div>
                <div className="loading-comp">
                <div className="d-flex justify-content-center">
                    <div className="loadingblue"></div>
                    <div className="loading-title-padding">
                     <h4 className="text-center">{statement}</h4>
                    </div>
                </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default LoadingBlue;