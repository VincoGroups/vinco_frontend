import React from 'react';
import firebase from '../../ServerSide/basefile'

class Useraccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountmodal: false
        }
    }

    AccountModal = ({accountmodal}) => {
        if (accountmodal === true) {
            return (
                <div>
                 <div className="modal-edu">
                  <div className="container">
                    <div className="modal-padding">
                     <div className="modal-container">
                      <span className="closebtndark" onClick={() => {
                          this.setState({
                              accountmodal: false
                          })
                      }}>&times;</span>
                      <h3>ACCOUNT</h3>
                      <h4>hello</h4>
                      <button className="button-logout" onClick={() => {
                         firebase.auth().signOut();
                     }}>LOGOUT</button>
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
        return (
            <div>
             <button className="button-submit" onClick={() => {
                this.setState({
                    accountmodal: true
                })
             }}>ACCOUNT</button>
             <this.AccountModal accountmodal={this.state.accountmodal}/>
            </div>
        )
    }
}

export default Useraccount;