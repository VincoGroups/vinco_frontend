import React from 'react';
const Fileview = ({url , type , currentfoldername}) => {
    if (type === "application/pdf") {
        return (
            <div>
             <iframe className="iframebody" title={currentfoldername} src={url} frameBorder="0"></iframe>
            </div>
        )
    } else {
        return (
            <div>
                <h4 className="text-center">WE ARE CURRENTLY WORKING ON WHY THIS IS NOT SHOWING</h4>
            </div>
        )
    }
}

export default Fileview;