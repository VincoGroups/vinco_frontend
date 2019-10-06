import React from 'react';

const FileViewer = ({url , type , name, callback}) => {  
   if (type === "application/pdf" || type === "") {
    const file = url + "#pagemode=none&scrollbar=0&toolbar=0&statusbar=1&messages=0&navpanes=0&width=100%";
     return <iframe src={file} name={name} title={name} className="pdffile" onClick={callback} />
   } else if (type === "application/json" || type === "text/javascript" ) {
       return <embed src={url} title={name} className="embedfile" onClick={callback}></embed>    
   } else if (type.includes("image/") === true) {
       return <img src={url} className="postimg" alt={name} onClick={callback}/>
   } else {
       return <h3 className="text-center">WE ARE WORKING ON IT</h3>
   }

}

export default FileViewer;