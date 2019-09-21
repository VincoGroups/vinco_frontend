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

    fetchNotifications = () => {
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

    componentDidMount() {
        this.fetchNotifications();
    }

    ShowNotifications = () => {
        return (
            <div>
              <h6>{this.state.res.length + ' Notifications'}</h6>
              <div className="notification-box">
                {
                    this.state.res.map(item => (
                        <div key={item.notificationid}>
                         <div className="notification-padding">
                         <div className={"header-notification-" + item.type}>
                          <h6>{item.displaycomment}</h6>
                          <h5>{item.extracomment}</h5>
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
                        <div className="modal-container-grey">
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
        console.log(this.state);
        return (
            <div>
              <div className="float-right">
              <span className="badge">{this.state.res.length}</span>
              </div>
              <i className="fa fa-bell" onClick={() => {
                  this.fetchNotifications();
                  this.setState({
                      show: true
                  })
              }}></i>
              <this.NotificationsModal show={this.state.show}/>
            </div>
        )
    }
}

export default Notifications;