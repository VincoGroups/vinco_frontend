import React from 'react';
import Authnav from '../Authnav';
import SubPostShow from './Subposts'
import SubShowBox from './SubBox'
import axios from 'axios';
class SubHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subres: [],
            subpost: true,
            subbox: false
        }
    }

   async componentDidMount() {
      const {mainapi} = this.props.match.params;
      const {subapi} = this.props.match.params;
      const {grouptype} = this.props.match.params;

    await axios.get('https://vincobackend.herokuapp.com/api/subgroup/getcreds/' + grouptype + '/' + mainapi + '/' + subapi)
      .then((body) => {
          this.setState({
              subres: body.data
          })
      }).catch((error) => {
          console.log(error)
      })
    }

    render() {
        console.log(this.state);
        return (
            <div>
              <Authnav/>
              <div className="page">
               <div className="subgroup-nav">
                <div className="container">
                <div className="float-right">
                <div className="row">
                   <div className="col-md-4">
                     <h6 className="text-center" onClick={() => {
                       this.setState({
                         subpost: true,
                         subbox: false
                       })
                     }}>POSTS</h6>
                   </div>
                   <div className="col-md-4">
                     <h6 className="text-center" onClick={() => {
                       this.setState({
                         subpost: false,
                         subbox: true
                       })
                     }}>BOX</h6>
                   </div>
                   <div className="col-md-4">
                     <h6 className="text-center">CHATS</h6>
                   </div>
                 </div> 
                </div>
                <h5>{this.state.subres.subgroupname}</h5>
                </div>
               </div>
               <div className="subgroup">
                <div className="container">
                 <SubPostShow 
                  subposts={this.state.subpost}
                  subgroupname={this.state.subres.subgroupname}
                  grouptype={this.state.subres.grouptype}
                  groupid={this.state.subres.groupid}
                  boxfilerid={this.state.subres.mainboxfilerid}
                  maingroupname={this.state.subres.maingroupname}
                  subgroupid={this.state.subres.subgroupid}
                  subid={this.state.subres.subid}
                  subpostid={this.state.subres.subgrouppost}
                  />
                  <SubShowBox 
                  subboxshow={this.state.subbox}
                  subgroupname={this.state.subres.subgroupname}
                  subid={this.state.subres.subid}
                  subgroupid={this.state.subres.subgroupid}
                  grouptype={this.state.subres.grouptype}
                  subboxid={this.state.subres.subboxfilerid}
                  groupid={this.state.subres.groupid}
                  />
                </div>
               </div>
              </div>
            </div>
        )
    }
}

export default SubHome;