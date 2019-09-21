import React from 'react';
import Authnav from '../Auth/Authcomps/Authnav';
import firebase from '../ServerSide/basefile';

class Pendinggroups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            res: [],
            showdetails: false,
            dets: []
        }
    }

    async componentDidMount() {
      await this.fetchPendingGroups()
    }

    fetchPendingGroups = () => {
        fetch('/api/group/pendinggroups/' + firebase.auth().currentUser.uid)
            .then((response) => {
                return response.json();
            }).then((bod) => {
                this.setState({
                    res: bod
                })
            }).catch((error) => {
                console.log(error);
            })
    }

    ShowDetails = ({showdetails , dets}) => {
        if (showdetails === true) {
            return (
                <div>
                    <div className="modal-edu">
                     <div className="container">
                      <div className="modal-padding">
                        <div className="modal-blue-container">
                         <span className="closebtnwhite" onClick={() => {
                             this.setState({
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

    PendingGroups = () => {
       if (this.state.res.length > 0) {
        return(
            <div>
              <div className="row">
                {
                    this.state.res.map(item => (
                        <div key={this.state.res.indexOf(item)}>
                        <div className="group-spacing">
                        <div className="pending-group-card slightshadow">
                            <span className="details" onClick={() => {
                                this.setState({
                                showdetails: true,
                                dets: item
                                })
                            }}></span>
                            <div className="pending-group-card-padding">
                            <h4 className="text-center">{item.groupname}</h4>
                            <div className="button-padding">
                            <button className="button-submit-lightblue" onClick={() => {
                                        fetch('/api/group/addtogroup/' + item.clientid + '/' + firebase.auth().currentUser.uid)
                                        .then((res) => {
                                            return res.json()
                                        }).then(() => {
                                            this.props.history.push('/dash');
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

    render() {
        return (
            <div>
             <Authnav/>
              <div className="page">
                <div className="pending-groups-page">
                 <div className="container">
                  <h3>PENDING GROUPS</h3>
                   <div className="group-padding">
                    <this.PendingGroups/>
                   </div>
                 </div>
                </div>
              </div>
              <this.ShowDetails showdetails={this.state.showdetails} dets={this.state.dets}/>
            </div>
        )
    }
}

export default Pendinggroups