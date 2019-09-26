import React from 'react';
import Authnav from '../Authnav';
import SubPostShow from './Subposts'

class SubHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subres: [],
            subpost: true
        }
    }

   async componentDidMount() {
      const {mainapi} = this.props.match.params;
      const {subapi} = this.props.match.params;
      const {grouptype} = this.props.match.params;

    await fetch('/api/subgroup/getcreds/' + grouptype + '/' + mainapi + '/' + subapi)
      .then((res) => {
          return res.json();
      }).then((body) => {
          this.setState({
              subres: body
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
                     <h6 className="text-center">POSTS</h6>
                   </div>
                   <div className="col-md-4">
                     <h6 className="text-center">BOX</h6>
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
                </div>
               </div>
              </div>
            </div>
        )
    }
}

export default SubHome;