import React from 'react';
import Authnav from './Authcomps/Authnav';
import firebase from '../ServerSide/basefile';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientid: '',
            clientgroupmodal: false,
            response: [],
            userresponse: []

        }
    }

   async componentDidMount() {
    await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            fetch('/api/group/getclients/' + user.uid)
            .then((res) => {
                return res.json()
            }).then((bod) => {
                this.setState({
                    userresponse: bod
                })
            }).catch((error) => {
                console.log(error);
            })
        }
    })
    }

    StatusBtn = ({status}) => {
        if (this.state.userresponse.includes(status) !== true) {
            return (
                <div>
                  <button onClick={() => {
                      fetch('/api/group/putrequest/' + this.state.response.groupid + '/' + firebase.auth().currentUser.uid, {
                          method: 'PUT',
                          headers:{
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                          }
                      }).then(() => {
                          this.setState({
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
   
    ClientGroupModal = ({clientgroupmodal}) => {
        if (clientgroupmodal === true) {
            return (
                <div>
                 <div className="modal-edu">
                  <div className="container">
                    <div className="modal-padding">
                     <div className="modal-container">
                      <span className="closebtndark" onClick={() => {
                          this.setState({
                              clientgroupmodal: false
                          })
                      }}>&times;</span>
                      <h2>{this.state.response.groupname}</h2>
                      <div className="client-padding">
                       <h5>{this.state.response.groupdescription}</h5>
                      </div>
                      <div className="button-padding">
                        <this.StatusBtn status={this.state.clientid}/>
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


    render() {
        console.log(this.state);
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
                                    this.setState({
                                    [e.target.name]: e.target.value
                                    })
                    }} required />
                     <span className="highlight"></span>
                     <span className="bar"></span>
                    <label className="labelbar">GROUP CODE</label>
                  </div>
                 </div>
                 <div className="longbutton text-center" onClick={() => {
                     fetch('/api/group/getclientgroup/' + this.state.clientid)
                     .then((res) => {
                         return res.json();
                     }).then((body) => {
                         this.setState({
                             response: body,
                             clientgroupmodal: true
                         })
                     }).catch((error) => {
                         console.log(error);
                     })
                 }}>ENTER</div>
                  </div>
                 </div>
                </div>
                <this.ClientGroupModal clientgroupmodal={this.state.clientgroupmodal}/>
            </div>
        )
    }
}

export default Search;