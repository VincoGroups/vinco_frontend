import React from 'react';
import firebase from '../basefile';
class Notifications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            res: [],
            numberofNotifications: 0,
            show: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            fetch('/user/getnotifications/' + firebase.auth().currentUser.uid)
            .then((res) => {
                return res.json();
            }).then((bod) => {
                this.setState({
                    res: bod
                })
            }).catch((error) => {
                console.log(error);
            })
        } , 500)
    }

    ShowNotifications = () => {
        return (
            <div>
              <div className="notification-box">
                {
                    this.state.res.map(item => (
                        <div key={item.notificationid}>
                         <div className="notification-padding">
                         <div className="header-notification">
                          <h6>{item.displaycomment}</h6>
                          <h4>{item.extracomment}</h4>
                         </div>
                         </div>
                        </div>
                    ))
                }
              </div>
            </div>
        )
    }

    NotificationsShown = () => {
        if (this.state.res.length > 0) {
            return (
                <div>
                    <div>
                        <this.ShowNotifications/>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className="no-notifications">
                     <h4 className="text-center">THERE ARE NO NOTIFICATIONS</h4>
                    </div>
                </div>
            )
        }
    }

    NotificationsModal = ({show}) => {
        if (show === true) {
            return (
                <div>
                    <div className="modal-edu">
                      <div className="container">
                       <div className="modal-padding">
                        <div className="modal-header-blue">
                         <span className="closebtnwhite" onClick={() => {
                             this.setState({
                                 show: false
                             })
                         }}>&times;</span>
                         <h2>YOUR NOTIFICATIONS</h2>
                        </div>
                        <div className="modal-container">
                         <div className="row">
                        
                         </div>
                         <this.NotificationsShown/>
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
    

    render () {
        return (
            <div>
              <h6 onClick={() => {
                  this.setState({
                      show: true
                  })
              }}>NOTIF</h6>
              <this.NotificationsModal show={this.state.show}/>
            </div>
        )
    }
}

export default Notifications;