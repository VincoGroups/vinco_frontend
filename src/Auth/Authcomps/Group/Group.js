import React from 'react';
import Authnav from '../Authnav';
import BoxFiler from './BoxFiler/BoxFiler';
import Mainchat from './Mainchat/Mainchat';
import Subchats from './Subchats/Subchats';
import firebase from '../../../ServerSide/basefile';

class Group extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            groupres : [],
            boxfiler: false,
            mainchat: false,
            subchat: true
        }
    }

   async componentDidMount() {
      const {groupapi} = this.props.match.params;
     await fetch('/api/group/' + groupapi)
      .then((res) => {
          return res.json();
      }).then((bod) => {
          this.setState({
              groupres: bod
          })
      }).catch((error) => {
          console.log(error)
      })
    }

    render() {
        return (
            <div>
             <Authnav/>
             <div className="page">
              <div className="group-navigation">
              <div className="float-right">
                <h6>{"Hi " + firebase.auth().currentUser.displayName}</h6>
              </div>
              <h4>{this.state.groupres.groupname}</h4>
              <div className="group-nav-padding">
                <div className="float-left">
                <div className="row">
                 <div className="col-md-4">
                  <h6 className="text-center" onClick={() => {
                      this.setState({
                        boxfiler: false,
                        mainchat: true,
                        subchat: false
                      })
                  }}>MAINCHAT</h6>
                 </div>
                 <div className="col-md-4">
                  <h6 className="text-center" onClick={() => {
                      this.setState({
                        boxfiler: false,
                        mainchat: false,
                        subchat: true
                      })
                  }}>SUBCHAT</h6>
                 </div>
                 <div className="col-md-4">
                  <h6 className="text-center" onClick={() => {
                      this.setState({
                        boxfiler: true,
                        mainchat: false,
                        subchat: false
                      })
                  }}>BOXFILER</h6>
                 </div>
                </div>
                </div>
              </div>
              </div>
              <div className="grouppage">
                <BoxFiler groupid={this.state.groupres.groupid} boxfiler={this.state.boxfiler} boxfilerid={this.state.groupres.boxfilerid} />
                <Mainchat groupid={this.state.groupres.groupid} wallpostid={this.state.groupres.wallpostid} mainchat={this.state.mainchat} mainchatname={this.state.groupres.groupname}/>
                <Subchats subchat={this.state.subchat}/>
              </div>
             </div>
            </div>
        )
    }
}

export default Group;