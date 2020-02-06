import React, {useState , useEffect, useCallback, useRef} from 'react';
import {generateId} from '../../../../ServerSide/functions';
import firebase from '../../../../ServerSide/basefile';
import LoadingBlue from '../../../../Comps/Loadingblue';
import FileViewer from './Fileview';
import axios from 'axios';
const FileNotes = ({filenotes, url , type ,grouptype , groupid, boxfilerid , currentfolderid, currentfileid , currentfilename}) => {
    const [notesres, setNotesRes] = useState({
        notesres: []
    })
    const [notesform, setNotesForm] = useState({
        notesform: false
    })
    const [currentnote, setCurrentNote] = useState({
        currentnote: {}
    })
    const [datapositionleft, setDataPositionLeft] = useState({
        datapositionleft: ''
    })
    const [datapositionright, setDataPositionRight] = useState({
        datapositionright: ''
    })
    const [stylepointleft, setStylePointLeft] = useState({
        stylepointleft: ''
    })
    const [stylepointright, setStylePointRight] = useState({
        stylepointright: ''
    })
    const [notemodal, setNoteModal] = useState({
        notemodal: false
    })

    const componentMounted = useRef(null);

    const fetchFileNotes = useCallback(() => {
       setTimeout(() => {
        if (componentMounted.current) {
            axios.get('https://vincobackend.herokuapp.com/api/boxfiler/getnotes/' + grouptype + '/' + groupid + '/' + boxfilerid + '/' + currentfolderid + '/' + currentfileid)
             .then((body) => {
                 console.log(body);
                 setNotesRes({
                     notesres: body.data
                 })
             }).catch((error) => {
                 console.log(error)
             })
        }
       }, 400);
    }, [grouptype, groupid, boxfilerid, currentfolderid, currentfileid])

    useEffect(() => {
     componentMounted.current = true
     if (filenotes === true) {
        if (currentfileid !== "" && currentfolderid !== "") {
            fetchFileNotes();
        }
     }
     return () => {componentMounted.current = false}
    }, [fetchFileNotes, currentfileid, currentfolderid, filenotes])

    if (filenotes === true) {
    
    const NotesTags = () => {
        return(
            <div>
          {
              notesres.notesres.map((item) => (
                  <div key={notesres.notesres.indexOf(item)}>
                     <div className={"notetag note-background-" + item.style} style={{left: item.styleleft , top: item.styleright }}></div>
                  </div>
              ))
          }  
        </div>
        )
    }

    const NoteModal = ({notemodal, item}) => {
      if (notemodal === true) {
        return (
            <div>
              <div className="modal-edu">
                <div className="container">
                 <div className="modal-padding">
                  <div className="modal-container">
                  <span className="closebtndark"  onClick={() => {
                      setNoteModal({
                          notemodal: false
                      })
                  }}>&times;</span>
                  <h3>NOTE</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <h4>{item.notepost}</h4>
                    </div>
                    <div className="col-md-6">
                     <div className="image-positioning">
                      <div className={"notetag note-background-" + item.style} style={{left: item.styleleft , top: item.styleright }}></div>
                      <FileViewer url={url} type={type} name={currentfilename}/>
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
          return null
      }
    }

    const CurrentNotesShown = () => {
     return (
         <div>
             {
                 notesres.notesres.map((item) => (
                     <div key={notesres.notesres.indexOf(item)}>
                        <div className={"card-note note-background-" + item.style} onClick={() => {
                            setCurrentNote({
                                currentnote: item
                            })
                            setNoteModal({
                                notemodal: true
                            })
                        }}>
                        <div className="float-right">
                        <h6>{item.displaydate}</h6>
                        </div>
                        <h6>{item.creator}</h6>
                        <div className="title-padding">
                        <h5>{item.notepost}</h5>
                        </div>
                        </div>
                     </div>
                 ))
             }
         </div>
     )
    }

    const NotesForm = ({notesform}) => {
        const [notesinput , setNotesInput] = useState({
            notesinput: ''
        })
        if (notesform === true) {
            return (
                <div>
                  <div className="modal-edu">
                    <div className="container">
                     <div className="modal-padding">
                      <div className="row">
                        <div className="col-md-6">
                         <div className="modal-container">
                         <span className="closebtndark" onClick={() => {
                             setNotesForm({
                                 notesform: false
                             })
                         }}>&times;</span>
                         <h3>MAKE NOTES</h3>
                         <div className="input-container">
                         <div className="group">      
                                <textarea type="text" className="inputbar" name="noteinput" onChange={(e) => {
                                    setNotesInput({
                                        notesinput: e.target.value
                                    })
                                }} required />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label className="labelbar">Write Note Here.</label>
                         </div>
                         </div>
                         <div className="input-container">
                            <button className="button-submit-blue" onClick={() => {
                                const timestamp = new Date();
                                const data = {
                                    backendpointleft: datapositionleft.datapositionleft,
                                    backendpointright: datapositionright.datapositionright,
                                    styleleft: stylepointleft.stylepointleft,
                                    styleright: stylepointright.stylepointright,
                                    grouptype: grouptype,
                                    groupid: groupid,
                                    boxfilerid: boxfilerid,
                                    folderid: currentfolderid,
                                    fileid: currentfileid,
                                    noteidentification: generateId(69),
                                    notepost: notesinput.notesinput,
                                    notedate: timestamp,
                                    creator: firebase.auth().currentUser.displayName,
                                    displaydate: timestamp.getMonth().toString() + '/' + timestamp.getDate() + '/' + timestamp.getFullYear(),
                                    style: notesres.notesres.length + 1 
                                }

                                console.log(data);
                                
                                axios.post('/api/boxfiler/postnotes/' + grouptype + '/' + groupid + '/' + boxfilerid + '/' + currentfolderid + '/' + currentfileid, data,{
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                }).then((body) => {
                                    notesres.notesres.push(body.data);
                                    setNotesRes({
                                        notesres: notesres.notesres
                                    })
                                    setNotesForm({
                                        notesform: false
                                    })
                                }).catch((error) => {
                                    console.log(error);
                                })
                            }}>CREATE NOTE</button>
                         </div>
                         </div>
                        </div>
                        <div className="col-md-6">
                         <div className="modal-container-blue">
                          <h6>{firebase.auth().currentUser.displayName}</h6>
                          <div className="input-container">
                            <h3>{notesinput.notesinput}</h3>
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
             <div className="row">
              <div className="col-md-4">
                <CurrentNotesShown />
              </div>
              <div className="col-md-8">
               <div className="image-positioning" onClick={(event) => {
                    let pos_x = event.nativeEvent.offsetX;
                    let pos_y = event.nativeEvent.offsetY;
                    let left_position = (pos_x-13).toString() + 'px';
                    let top_position = (pos_y-13).toString() + 'px';
                    console.log(pos_x);
                    console.log(pos_y);
                    setNotesForm({
                        notesform: true
                    })
                    setDataPositionLeft({
                        datapositionleft: pos_x
                    })
                    setDataPositionRight({
                        datapositionright: pos_y
                    })
                    setStylePointLeft({
                        stylepointleft: left_position
                    })
                    setStylePointRight({
                        stylepointright: top_position
                    })
                }}>
                <NotesTags/>
                <FileViewer url={url} type={type} name={currentfilename}/>
               </div>
              </div>
             </div>
             <NotesForm notesform={notesform.notesform}/>
             <NoteModal notemodal={notemodal.notemodal} item={currentnote.currentnote}/>
          </div>
      )
    } else {
        return null;
    }
}
const FileComments = ({ filecomment, url , type ,grouptype , groupid, boxfilerid , currentfolderid, currentfileid , currentfilename}) => {
    const [outputfilecomment, setOutputFileComment] = useState({
        outputfilecomment: ''
    })
    const [outputfileres, setOutputFileRes] = useState({
        outputfileres: []
    })
    const [loadingfile, setLoadingFile] = useState({
        loading: true
    })

    const fetchFileComments = useCallback(() => {
        setTimeout(() => {
          if (componentMounted.current) {
            axios.get('https://vincobackend.herokuapp.com/api/boxfiler/getfilecomments/' + grouptype + '/' + groupid + '/' + boxfilerid + '/' + currentfolderid + '/' + currentfileid)
            .then((bod) => {
                console.log(bod);
                setOutputFileRes({
                   outputfileres: bod.data
                })
                setLoadingFile({
                    loading: false
                })
            }).catch((error) => {
                console.log(error);
            })
          }    
        } , 400);
    } , [grouptype, groupid, boxfilerid, currentfileid, currentfolderid]);


    const componentMounted = useRef(null);
    
    useEffect(() => {
      setLoadingFile({
          loading: true
      })
        componentMounted.current = true;
                if (filecomment === true) {
                    if (currentfileid !== "" && currentfolderid !== "") {
                     fetchFileComments()
                    }
                 } 

            return () => {componentMounted.current = false}
            
    }, [fetchFileComments, filecomment , currentfileid, currentfolderid])

    
    if (filecomment === true) {
        const CommentOutput = () => {
            const outputdata = {
                comment: outputfilecomment.outputfilecomment,
                date: new Date(),
                creator: firebase.auth().currentUser.uid,
                displayname: firebase.auth().currentUser.displayName,
                commentid: generateId(54)
            }
    
            axios.put('https://vincobackend.herokuapp.com/api/boxfiler/commentonfile/'  + grouptype + '/' + groupid + '/' + boxfilerid + '/' + currentfolderid + '/' + currentfileid , outputdata,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(() => {
             return fetchFileComments();
            }).catch((error) => {
                console.log(error);
            })
        }
    
       const OutputComment = () => {
            return (
                <div>
                    {
                        outputfileres.outputfileres.map(item => (
                            <div key={outputfileres.outputfileres.indexOf(item)}>
                                <div className="comment-container">
                                  <h6 className="comment d-inline-flex p-2">{item.displayname + ': ' + item.comment}</h6>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
        }
    
    
            return(
                <div>
                    <div className="row">
                     <div className="col-md-4">
                     <input type="text" className="input-comment-blue" name="outputfilecomment" onChange={(e) => {
                        setOutputFileComment({
                            outputfilecomment : e.target.value
                        })
                        }} onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                            CommentOutput();
                        }
                        }} placeholder="Comment on this file..."/>
                        <div className="input-container">
                         <OutputComment/>
                        </div>
                     </div>
                     <div className="col-md-8">
                      <FileViewer url={url} type={type} name={currentfilename}/>
                     </div>
                    </div>
                    <LoadingBlue loading={loadingfile.loading}/>
                </div>
            )
    } else {
        return null;
    }
}


const BoxFiler = ({boxfiler , grouptype ,groupid, boxfilerid}) => {
    const [foldermodal , setFolderModal] = useState({
        foldermodal: false
    })
    const [addfilemodal, setAddFileModal] = useState({
        addfilemodal: false
    })
    const [groupres, setGroupRes] = useState({
        groupresp: []
    })
    const [currentfolderid, setCurrentFolderId] = useState({
        currentfolderid: ''
    })
    const [currentfoldername, setCurrentFolderName] = useState({
        currentfoldername: ''
    })
    const [currentfilename, setCurrentFileName] = useState({
        currentfilename: ''
    })
    const [currentfileid, setCurrentFileId] = useState({
        currentfileid: ''
    })
    const [currentfiletype, setCurrentFileType] = useState({
        currentfiletype: ''
    })
    const [outputfile, setOutputFile] = useState({
        outputfile: false
    })
    const [url, setUrl] = useState({
        url: ''
    })
    const [loading, setLoading] = useState({
        loading: true
    })
    const [commentfile, setCommentFile] = useState({
        commentfile: true
    })
    const [notescomment, setNotesComment] = useState({
        notescomment: false
    })
 

    const fetchFolders = useCallback(() => {
        setTimeout(() => {
        axios.get('https://vincobackend.herokuapp.com/api/boxfiler/getfolders/' + grouptype + '/' + groupid + '/' + boxfilerid)
        .then((bod) => {
            setGroupRes({
                groupresp: bod.data,
            })
            setLoading({
                loading: false
            })
        }).catch((error) => {
            console.log(error);
        })
        } , 400)
     }, [boxfilerid , groupid, grouptype])
 
    useEffect(() => {
       setLoading({
           loading: true
       })
       if (boxfiler === true) {
        fetchFolders();
       }
    }, [boxfiler, fetchFolders])


    if (boxfiler === true) {   
     const OutputFiler = ({outputfile , currentfilename}) => {    
        if (outputfile === true) {
            return (
                <div>
                    <div className="modal-edu-white">
                        <div className="container">
                          <div className="modal-padding">
                             <span className="closebtndark" onClick={() => {
                                setOutputFile({
                                    outputfile: false
                                })
                             }}>&times;</span>
                              <h3>{currentfilename}</h3>
                              <div className="input-container">
                                <div className="row">
                                 <div className="col-md-12">
                                 <div className="float-left">
                                    <div className="row">
                                    <div className="col-md-6">
                                    <button className="button-submit-blue" onClick={() => {
                                        setCommentFile({
                                            commentfile: true
                                        })
                                        setNotesComment({
                                            notescomment: false
                                        })
                                    }}>COMMENTS</button>
                                    </div>
                                    <div className="col-md-6">
                                    <button className="button-submit" onClick={() => {
                                        setCommentFile({
                                            commentfile: false
                                        })
                                        setNotesComment({
                                            notescomment: true
                                        })
                                    }}>NOTES</button>
                                    </div>
                                    </div>
                                 </div>
                                 </div>
                                </div>
                              </div>
                              <FileComments 
                              filecomment={commentfile.commentfile} 
                              currentfileid={currentfileid.currentfileid} 
                              currentfolderid={currentfolderid.currentfolderid} 
                              currentfilename={currentfilename}  
                              type={currentfiletype.currentfiletype}
                              url={url.url}
                              groupid={groupid}
                              grouptype={grouptype}
                              boxfilerid={boxfilerid}
                              />
                              <FileNotes
                              filenotes={notescomment.notescomment}
                              url={url.url}
                              type={currentfiletype.currentfiletype}
                              currentfilename={currentfilename}
                              groupid={groupid}
                              grouptype={grouptype}
                              boxfilerid={boxfilerid}
                              currentfileid={currentfileid.currentfileid}
                              currentfolderid={currentfolderid.currentfolderid}
                              />
                          </div>
                        </div>
                    </div>
                </div>
            )
        } else {    
            return null;
        }
    }


    const Folders = () => {
        if (groupres.groupresp.length > 0) {
            return (
                <div>
                    {
                        groupres.groupresp.map(item => (
                            <div key={groupres.groupresp.indexOf(item)}>
                             <div className="folder-component-padding">
                             <div className="folder-output">
                              <div className="row">
                               <div className="col-md-10" onClick={() => {
                                 const foldername = document.getElementById(item.foldername);
                                 if (foldername.classList.contains('hide') === true) {
                                     foldername.classList.remove('hide');
                                 } else {
                                     foldername.classList.add('hide');
                                 }
                             }}>
                                <h6 className="folder-subheader">{item.files.length + " files"}</h6>
                                <h4>{item.foldername}</h4>
                               </div>
                               <div className="col-md-2">
                                <div className="button-padding">
                                <button className="button-submit" onClick={() => {
                                    setAddFileModal({
                                        addfilemodal: true
                                    })
                                    setCurrentFolderName({
                                        currentfoldername: item.foldername,
                                    })
                                    setCurrentFolderId({
                                        currentfolderid: item.folderid
                                    })
                                }}>ADD FILES</button>
                                </div>
                               </div>
                              </div>
                             </div>
                             <div id={item.foldername} className="file-components hide">
                              {
                                  item.files.map(index => (
                                      <div key={item.files.indexOf(index)}>
                                          <div className="file-output" onClick={() => {
                                            firebase.storage().ref(groupid + '/' + boxfilerid + '/' + item.folderid + '/' + index.filename)
                                            .getDownloadURL().then((url) => {
                                                var xhr = new XMLHttpRequest();
                                                xhr.responseType = 'blob';
                                                xhr.onload = (event) => {
                                                    var blob = xhr.response;
                                                    console.log(blob)
                                                };
                                                xhr.open('GET', url);
                                                xhr.send();
                                                setUrl({
                                                    url: url
                                                })
                                                setCurrentFileName({
                                                    currentfilename: index.filename
                                                })
                                                setOutputFile({
                                                    outputfile: true
                                                })
                                                setCurrentFolderId({
                                                    currentfolderid: item.folderid
                                                })
                                               setCurrentFileId({
                                                   currentfileid: index.fileid
                                               })
                                               setCurrentFileType({
                                                   currentfiletype: index.filetype
                                               })
                                                
                                            }).catch((error) => {
                                                console.log(error);
                                            })
                                          }}>
                                            <h6>{index.filename}</h6>
                                          </div>
                                      </div>
                                  ))
                              }
                             </div>
                             </div>
                            </div>
                        ))
                    }
                </div>
            )   
        } else {
                return (
                    <div>
                      <div className="empty-container">
                          <h1 className="text-center">THERE ARE NO FOLDERS IN THE GROUP</h1>
                      </div>
                    </div>
                )
            }
    }
     
    const AddFileModal = ({addfilemodal , currentfolderid, currentfoldername}) => {
        if (addfilemodal === true) {
            return (
                <div>
                    <div className="modal-edu">
                      <div className="container">
                        <div className="modal-padding">
                         <div className="modal-header-blue">
                         <span className="closebtnwhite" onClick={() => {
                             setAddFileModal({
                                 addfilemodal: false
                             })
                         }}>&times;</span>
                           <h2>{ 'Add Files to ' + currentfoldername}</h2>
                         </div>
                         <div className="modal-container">
                          <div className="box-blue" onDrop={(e) => {
                              e.preventDefault();
                              const files = e.dataTransfer.files;
                              const filedata = [];
                              for (let i = 0; i < files.length; i++) {
                                  const fileid = generateId(98);
                                  const filejson = {}
                                  filejson['filename'] = files[i].name;
                                  filejson['filetype'] = files[i].type;
                                  filejson['filesize'] = files[i].size;
                                  filejson['fileid'] = fileid
                                  filedata.push(filejson);
                             }

                              const data = {
                                  folderid: currentfolderid,
                                  filedata: filedata
                              }
                              
                              axios.post('https://vincobackend.herokuapp.com/api/boxfiler/addfiles/'  + grouptype + '/' + groupid + '/' + boxfilerid + '/' + data.folderid, data,{
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                  },
                              }).then((body) => {
                                  if(body.data.res === true) {
                                      for(let j = 0; j < files.length; j++) {
                                        firebase.storage().ref(groupid  + '/' + boxfilerid + '/' + data.folderid + '/' + files[j].name)
                                        .put(files[j]);
                                      }
                                      setAddFileModal({
                                          addfilemodal: false
                                      })

                                      fetchFolders();
                                  }
                              }).catch((error) => {
                                  console.log(error);
                              })
                          }} onDragOver={(e) => {
                              e.preventDefault();
                          }} onDragLeave={(e) => {
                              e.preventDefault();
                          }}>
                            <div className="row">
                             <div className="col-md-4">
                              <h3 className="text-center">DROP FILES HERE</h3>
                             </div>
                             <div className="col-md-4">
                              <h3 className="text-center">OR</h3>
                             </div>
                             <div className="col-md-4">
                              <input type="file" onChange={(e) => {
                                  const files = e.target.files;
                                  const filedata = [];
                                  for (let i = 0; i < files.length; i++) {
                                      const fileid = generateId(98);
                                      const filejson = {}
                                      filejson['filename'] = files[i].name;
                                      filejson['filetype'] = files[i].type;
                                      filejson['filesize'] = files[i].size;
                                      filejson['fileid'] = fileid
                                      filedata.push(filejson);
                                 }
    
                                  const data = {
                                      folderid: currentfolderid,
                                      filedata: filedata
                                  }
                                  
                                  axios.post('https://vincobackend.herokuapp.com/api/boxfiler/addfiles/'  + grouptype + '/' + groupid + '/' + boxfilerid + '/' + data.folderid, data,{
                                      headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                      },
                                  }).then((body) => {
                                      if(body.data.res === true) {
                                          for(let j = 0; j < files.length; j++) {
                                            firebase.storage().ref(groupid  + '/' + boxfilerid + '/' + data.folderid + '/' + files[j].name)
                                            .put(files[j]);
                                          }
                                          setAddFileModal({
                                              addfilemodal: false
                                          })

                                          fetchFolders();
                                      }
                                  }).catch((error) => {
                                      console.log(error);
                                  })
                              }} multiple/>
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

      const FolderModal = ({foldermodal}) => {
        const [foldername , setFolderName] = useState({
            foldername: ''
        })
        
        console.log(foldername);
            if (foldermodal === true) {
                return (
                    <div>
                      <div className="modal-edu">
                        <div className="container">
                         <div className="modal-padding">
                         <div className="modal-header-white">
                         <span className="closebtnlightblue" onClick={() => {
                                setFolderModal({
                                    foldermodal: false
                                })
                            }}>&times;</span>
                            <h3>CREATE FOLDER</h3>
                         </div>
                          <div className="modal-blue-container">
                            <div className="input-container">
                                <div className="group">      
                                    <input type="text" className="inputbar-white" name="foldername" onChange={(e) => {
                                        setFolderName({
                                            foldername: e.target.value
                                        })
                                    }} required />
                                    <span className="highlight-white"></span>
                                    <span className="bar-white"></span>
                                    <label className="labelbar-white">Name of Group</label>
                                </div>
                            </div>
                            <div className="input-container">
                              <div className="drop-box" onDrop={(e) => {
                                  e.preventDefault();
                                  const files = e.dataTransfer.files;
                                  const filedata = [];
                                  for (let i = 0; i < files.length; i++) {
                                      const fileid = generateId(98);
                                      const filejson = {}
                                      filejson['filename'] = files[i].name;
                                      filejson['filetype'] = files[i].type;
                                      filejson['filesize'] = files[i].size;
                                      filejson['fileid'] = fileid
                                      filedata.push(filejson);
                                 }
    
                                  const folderid = generateId(50);
    
                                  const data = {
                                      foldername: foldername.foldername,
                                      folderid: folderid,
                                      filedata: filedata
                                  }
                                  
                                  axios.post('/api/boxfiler/createfolder/'  + grouptype + '/' + groupid + '/' + boxfilerid + '/' + data.folderid, data,{
                                      headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                      },
                                  }).then((body) => {
                                      if(body.data.res === true) {
                                          for(let j = 0; j < files.length; j++) {
                                            firebase.storage().ref(groupid  + '/' + boxfilerid + '/' + folderid + '/' + files[j].name)
                                            .put(files[j]);
                                          }
                                          setFolderModal({
                                              foldermodal: false
                                          })
    
                                          fetchFolders();
                                      }
                                  }).catch((error) => {
                                      console.log(error);
                                  })
                              }} onDragOver={(e) => {
                                e.preventDefault();
                                return false
                              }} onDragLeave={(e) => {
                                  e.preventDefault();
                                  return false
                              }}>
                                <div className="row">
                                 <div className="col-md-4">
                                  <h3 className="text-center">DROP FILES HERE</h3>
                                 </div>
                                 <div className="col-md-4">
                                  <h3 className="text-center">OR</h3>
                                 </div>
                                 <div className="col-md-4">
                                  <input type="file" onChange={(e) => {
                                      const files = e.target.files;
                                      const filedata = [];
                                      for (let i = 0; i < files.length; i++) {
                                          const fileid = generateId(98);
                                          const filejson = {}
                                          filejson['filename'] = files[i].name;
                                          filejson['filetype'] = files[i].type;
                                          filejson['filesize'] = files[i].size;
                                          filejson['fileid'] = fileid
                                          filedata.push(filejson);
                                     }
    
                                      const folderid = generateId(50);
    
                                      const data = {
                                          foldername: foldername.foldername,
                                          folderid: folderid,
                                          filedata: filedata
                                      }
                                      
                                      axios.post('/api/boxfiler/createfolder/'  + grouptype + '/' + groupid + '/' + boxfilerid + '/' + data.folderid, data,{
                                          headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                          },
                                      }).then((body) => {
                                          if(body.data.res === true) {
                                            for (let j = 0; j < files.length; j++) {
                                                firebase.storage().ref(groupid  + '/' + boxfilerid + '/' + data.folderid + '/' + files[j].name)
                                                .put(files[j]);
                                            }
                                              setFolderModal({
                                                  foldermodal: false
                                              })
    
                                              fetchFolders();
                                          }
                                      }).catch((error) => {
                                          console.log(error);
                                      })
    
                                  }} multiple/>
                                 </div>
                                </div>
                              </div>
                            </div>
                          </div>
                         </div>
                        </div>
                      </div>
                    </div>
                )
            } else  {
                return null;
            }
        }

        return (
          <div>
             <div className="folders-container">
             <div>
                <div className="group-page">
                <div className="float-right">
                    <button className="button-submit" onClick={() => {
                        setFolderModal({
                            foldermodal: true
                        })
                    }}>CREATE FOLDER</button>
                    </div>
                    <h2>FOLDERS</h2>
                </div>
                <LoadingBlue loading={loading.loading}/>
                <div>
                <Folders/>
                </div>
                <FolderModal foldermodal={foldermodal.foldermodal}/>
                <AddFileModal addfilemodal={addfilemodal.addfilemodal} currentfolderid={currentfolderid.currentfolderid} currentfoldername={currentfoldername.currentfoldername}/>
                <OutputFiler currentfilename={currentfilename.currentfilename} url={url.url} outputfile={outputfile.outputfile}/>
                </div>
             </div>
          </div>
        )
    } else {
        return null;
    }

}

export default BoxFiler;