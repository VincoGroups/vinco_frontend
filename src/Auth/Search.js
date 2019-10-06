import React, {useState, useEffect, useRef} from 'react';
import Authnav from './Authcomps/Authnav';
import firebase from '../ServerSide/basefile';

const Search = () => {
   const [clientid, setClientId] = useState({
       clientid: ''
   })
   const [response, setResponse] = useState({
       response: []
   })
   const [clientgroupmodal, setClientGroupModal] = useState({
       clientgroupmodal: false
   })
   const [userresponse, setUserResponse] = useState({
     userresponse: []
   })
   
   const componentMounted = useRef(null)

   useEffect(() => {
    componentMounted.current = true
    if (componentMounted.current) {
        fetch('/api/group/getclients/' + firebase.auth().currentUser.uid)
    .then((res) => {
        return res.json()
    }).then((bod) => {
        setUserResponse({
            userresponse: bod
        })
    }).catch((error) => {
        console.log(error);
    })
    }

    return () => {componentMounted.current = false}
   })

   const StatusBtn = ({status}) => {
        if (userresponse.userresponse.includes(status) !== true) {
            return (
                <div>
                  <button onClick={() => {
                      fetch('/api/group/putrequest/' + response.response.groupid + '/' + firebase.auth().currentUser.uid, {
                          method: 'PUT',
                          headers:{
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                          }
                      }).then(() => {
                          setClientGroupModal({
                              clientgroupmodal: false
                          })
                      }).catch((error) => {
                          console.log(error);
                      })
                  }} className="button-submit">JOIN GROUP</button>
                </div>
            )
        } else {
            return (
                <div>
                  <div className="red-label">
                    <h6 className="text-center">YOURE ALREADY IN THIS GROUP</h6>
                  </div>
                </div>
            )
        }
    }
   
   const ClientGroupModal = ({clientgroupmodal}) => {
        if (clientgroupmodal === true) {
            return (
                <div>
                 <div className="modal-edu">
                  <div className="container">
                    <div className="modal-padding">
                     <div className="modal-container">
                      <span className="closebtndark" onClick={() => {
                          setClientGroupModal({
                              clientgroupmodal: false
                          })
                      }}>&times;</span>
                      <h2>{response.response.groupname}</h2>
                      <div className="client-padding">
                       <h5>{response.response.groupdescription}</h5>
                      </div>
                      <div className="button-padding">
                        <StatusBtn status={clientid.clientid}/>
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
                <Authnav/>
                <div className="page">
                 <div className="search-page">
                  <div className="container">
                  <h1 className="text-center">SEARCH</h1>
                  <div className="input-container">
                    <div className="group">      
                     <input type="text" className="inputbar" name="clientid" onChange={(e) => {
                      setClientId({
                         clientid: e.target.value
                      })
                    }} required />
                     <span className="highlight"></span>
                     <span className="bar"></span>
                    <label className="labelbar">GROUP CODE</label>
                  </div>
                 </div>
                 <div className="longbutton text-center" onClick={() => {
                     fetch('/api/group/getclientgroup/' + clientid.clientid)
                     .then((res) => {
                         return res.json();
                     }).then((body) => {
                         setResponse({
                            response: body
                         })
                         setClientGroupModal({
                             clientgroupmodal: true
                         })
                     }).catch((error) => {
                         console.log(error);
                     })
                 }}>ENTER</div>
                  </div>
                 </div>
                </div>
                <ClientGroupModal clientgroupmodal={clientgroupmodal.clientgroupmodal}/>
            </div>
        )
    
}

export default Search;