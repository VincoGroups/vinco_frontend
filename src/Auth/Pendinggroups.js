import React, {useState, useEffect, useRef} from 'react';
import Authnav from '../Auth/Authcomps/Authnav';
import firebase from '../ServerSide/basefile';
import axios from 'axios';

const Pendinggroups = (props) =>{
    const [res, setRes] = useState({
        res: []
    })
    const [showdetails, setShowDetails] = useState({
        showdetails: false
    })
    const [dets, setDets] = useState({
        dets: []
    })

    const componentMounted = useRef(null);

    useEffect(() => {
    componentMounted.current = true
      if (componentMounted.current) {
        axios.get('https://vincobackend.herokuapp.com/api/group/pendinggroups/' + firebase.auth().currentUser.uid)
        .then((bod) => {
            setRes({
                res: bod.data
            })
        }).catch((error) => {
            console.log(error);
        })
      }
    }, [])
    

   const ShowDetails = ({showdetails , dets}) => {
        if (showdetails === true) {
            return (
                <div>
                    <div className="modal-edu">
                     <div className="container">
                      <div className="modal-padding">
                        <div className="modal-blue-container">
                         <span className="closebtnwhite" onClick={() => {
                             setShowDetails({
                                 showdetails: false
                             })
                         }}>&times;</span>
                         <div className="title-padding">
                          <h3>{dets.groupname}</h3>
                          <h6>{"Group ID: " + dets.clientid}</h6>
                         </div>
                          <h6>{dets.groupdescription}</h6>
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

   const PendingGroups = () => {
       if (res.res.length > 0) {
        return(
            <div>
              <div className="row">
                {
                    res.res.map(item => (
                        <div key={res.res.indexOf(item)}>
                        <div className="group-spacing">
                        <div className="pending-group-card slightshadow">
                            <span className="details" onClick={() => {
                                setShowDetails({
                                    showdetails: true
                                })
                                setDets({
                                    dets: item
                                })
                            }}></span>
                            <div className="pending-group-card-padding">
                            <h4 className="text-center">{item.groupname}</h4>
                            <div className="button-padding">
                            <button className="button-submit-lightblue" onClick={() => {
                                        axios.get('https://vincobackend.herokuapp.com/api/group/addtogroup/' + item.clientid + '/' + firebase.auth().currentUser.uid)
                                        .then(() => {
                                            props.history.push('/dash');
                                        }).catch((error) => {
                                            console.log(error)
                                        })
                                    
                            }}>JOIN GROUP</button>
                            </div>
                            </div>
                        </div>
                        </div>
                        </div>
                    ))
                }
              </div>
            </div>
        )
       } else {
         return (
             <div>
                 <div className="no-pending">
                 <h1 className="text-center">YOU DON'T HAVE ANY PENDING GROUP INVITATIONS</h1>
                 </div>
             </div>
         )
       }
    }

        return (
            <div>
             <Authnav/>
              <div className="page">
                <div className="pending-groups-page">
                 <div className="container">
                  <h3>PENDING GROUPS</h3>
                   <div className="group-padding">
                    <PendingGroups/>
                   </div>
                 </div>
                </div>
              </div>
              <ShowDetails showdetails={showdetails.showdetails} dets={dets.dets}/>
            </div>
        )
    
}

export default Pendinggroups