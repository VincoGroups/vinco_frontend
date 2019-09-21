import React from 'react';

const FileViewer = ({url , type , name}) => {
   if (type === "application/pdf" || type === "") {
    const file = url + "#pagemode=none&scrollbar=0&toolbar=0&statusbar=1&messages=0&navpanes=0&width=100%";
     return (
      <div>
         <iframe src={file} name={name} title={name} className="pdffile" />
      </div>
     )
   } else if (type === "application/json") {
       return (
           <div>
             <embed src={url} title={name} className="embedfile"></embed>
           </div>
       )
   } else if (type === "text/javascript") {
      return (
          <div>
            <embed src={url} title={name} className="embedfile"></embed>
          </div>
      )
   } else if (type.includes("image/") === true) {
       return (
           <div>
             <img src={url} className="postimg" alt={name}/>
           </div>
       )
   } else {
       return (
           <div>
             <h3 className="text-center">WE ARE WORKING ON IT</h3>
           </div>
       )
   }

}

export default FileViewer;