import React, {useState , useEffect} from 'react';
import Useraccount from './Useraccount';
import {NavLink} from 'react-router-dom';
import firebase from '../../ServerSide/basefile'
import axios from 'axios';
const Authnav = () => {

  const [remindermodal , setReminder] = useState({
      modal: false
  })

  const [reminders, setReminders] = useState({
    reminders: []
  })

  const [detailsmodal, setDetailsModal] = useState({
    detailsmodal: false
  })

  const [detailsreminder , setDetails] = useState({
    details: []
  })

  useEffect(() => {
    axios.get('https://vincobackend.herokuapp.com/api/reminders/fetchreminders/' + firebase.auth().currentUser.uid)
    .then((body) => {
      setReminders({
        reminders: body.data
      })
    }).catch((errors) => {
      console.log(errors);
    })
  }, [])


  const ReminderPost = ({text}) => {
    if (text.length > 25) {
      return <h4>{text.substring(0,26) + ' ...'}</h4>
    } else {
      return <h4>{text}</h4>
    }
  }
  

  const OutputReminders = () => {
    return (
      <div>
         <div className="row">
         {
            reminders.reminders.map((item) => (
              <div key={reminders.reminders.indexOf(item)}>
                <div className="reminder-padding">
                  <div className="slightshadow">
                  <div className="reminder-card-headers">
                    <div className="float-right">
                      <h6 className="small-text">{item.postremindertime}</h6>
                    </div>
                    <h6>{item.groupname}</h6>
                  </div>
                  <div className="reminder-container" onClick={() => {
                    setDetails({
                      details: item
                    })
                    setDetailsModal({
                      detailsmodal: true
                    })
                  }}>
                    <ReminderPost text={item.reminderpost}/>
                  </div>
                  </div>
                </div>
              </div>         
            ))
          }
         </div>
      </div>
    )
  }

 const ModalReminderDetails = ({modalreminderdetails, item}) => {
    if (modalreminderdetails === true) {
        return (
            <div className="modal-edu">
             <div className="container">
              <div className="modal-padding">
                <div className="modal-container-blue">
                 <span className="closebtnwhite" onClick={() => {
                   setDetailsModal({
                     detailsmodal: false
                   })
                 }}>&times;</span>
                 <div className="reminder-container-details">
                  <h4>{item.reminderpost}</h4>
                   <div className="reminder-subcontainer">
                    <div className="input-container">
                     <div className="row">
                        {
                          item.usernames.map((index) => (
                            <div key={item.usernames.indexOf(index)}>
                              <div className="small-container">
                                <h6 className="small-name-padding">{index}</h6>
                              </div>
                            </div>
                          ))
                        }
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

  const ModalReminder = ({remindermodal}) => {
    if (remindermodal === true) {
      return (
        <div>
          <div className="modal-edu">
            <div className="container">
              <div className="modal-padding">
                <div className="modal-container">
                  <span className="closebtndark" onClick={() => {
                    setReminder({
                      modal: false
                    })
                  }}>&times;</span>
                  <h3>REMINDERS</h3>
                  <button className="button-submit-blue">MAKE REMINDER</button>
                  <div className="input-container">
                    <OutputReminders/>
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
     <div className="AuthNav">
      <div className="container">
        <div className="row">
         <div className="col-md-6">
          <h5>VINCO</h5>
         </div>
         <div className="col-md-6">
           <div className="row">
           <div className="col-md-3">
              <div className="nav-padding">
              <NavLink to="/dash" className="navlink-auth"><h6>HOME</h6></NavLink>
              </div>
           </div>
           <div className="col-md-3">
            <div className="nav-padding">
              <h6 className="navlink-auth" onClick={() => {
                setReminder({
                  modal: true
                })
              }}>CALENDAR</h6>
            </div>
           </div>
           <div className="col-md-3">
             <div className="nav-padding">
              <NavLink to="/search" className="navlink-auth"><h6>SEARCH</h6></NavLink>
             </div>
            </div>
            <div className="col-md-3">
               <Useraccount/>
            </div>
           </div>
         </div>
        </div>
      </div>
     </div>
     <ModalReminder remindermodal={remindermodal.modal}/>
     <ModalReminderDetails modalreminderdetails={detailsmodal.detailsmodal} item={detailsreminder.details} />
    </div>
  )
}

export default Authnav;