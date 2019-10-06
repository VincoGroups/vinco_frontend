import React from 'react';
import '../App.css'

const LoadingWhite = ({loading}) => {
    if(loading === true) {
        return (
            <div>
                <div className="loading-comp">
                <div className="d-flex justify-content-center">
                    <div className="loadingwhite"></div>
                    <h1 className="text-center">LOADING CONTENT</h1>
                </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default LoadingWhite;