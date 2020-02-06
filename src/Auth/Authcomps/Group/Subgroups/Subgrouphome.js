import React from 'react';
import Adduserssubgroup from './functions/Adduserssubgroup';
import {generateId} from '../../../../ServerSide/functions';
import firebase from '../../../../ServerSide/basefile';
import {NavLink} from 'react-router-dom';
import axios from 'axios';
class Subgrouphome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            subgroupres: [],
            subgroupmodal: false,
            subgroupname: '',
            subgroupdescription: '',
            subgroupusers: [],
            subgroupaddedmembers: [],
            areyouinthissubgroup: true
        }
    }

    fetchSubgroups = () => {
        setTimeout(() => {
            axios.get('https://vincobackend.herokuapp.com/api/subgroup/getusersubgroups/' + this.props.grouptype + '/' + this.props.groupid + '/' + firebase.auth().currentUser.uid)
            .then((res) => {
                    this.setState({
                        subgroupres: res.data
                    })
            }).catch((error) => {
                console.log(error);
            })
        }, 500);
    }

    componentDidMount() {
        this.fetchSubgroups();
    }

    SwitchTitleSubgroup = () => {
        if (this.state.subgroupname > 0) {
            return (
                <div>
                  <h5>{`Are you in the ${this.state.subgroupname} Sub group?`}</h5>
                </div>
            )
        } else {
            return (
                <div>
                  <h3>Are you in this subgroup?</h3>
                </div>
            )
        }
    }

    OutputSubgroups = () => {
        return (
            <div>
             <div className="row">
                {this.state.subgroupres.map((item) => (
                    <div key={this.state.subgroupres.indexOf(item)}>
                    <div className="group-spacing">
                     <NavLink className="groupnav" to={"/subgroup/" + item.grouptype + '/' + item.maingroupapi + "/" + item.subgroupapi}>
                      <div className="group-card-pretty-blue slightshadow">
                        <h3 className="text-center">{item.subgroupname}</h3>
                      </div>
                     </NavLink>
                    </div>
                    </div>
                ))}
             </div>
            </div>
        )
    }
    

    CreateSubGroup = ({subgroupmodal}) => {
        if (subgroupmodal === true) {
            return (
                <div>
                 <div className="modal-edu">
                  <div className="container">
                   <div className="modal-padding">
                    <div className="modal-header-white">
                     <span className="closebtndark" onClick={() => {
                         this.setState({
                           subgroupmodal: false
                         })
                     }}>&times;</span>
                      <h3>CREATE A SUBGROUP</h3>
                    </div>
                    <div className="modal-container">
                     <div className="input-container">
                        <div className="group">      
                            <input type="text" className="inputbar" name="subgroupname" onChange={(e) => {
                            this.setState({
                                [e.target.name]: e.target.value
                            })
                            }} required />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className="labelbar">Name of Subgroup</label>
                        </div>
                     </div>
                     <div className="input-container">
                        <div className="group">      
                            <input type="text" className="inputbar" name="subgroupdescription" onChange={(e) => {
                            this.setState({
                                [e.target.name]: e.target.value
                            })
                            }} required />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className="labelbar">Description of Subgroup</label>
                        </div>
                     </div>
                     <div className="input-container">
                        <this.SwitchTitleSubgroup/>
                        <label>
                            <input type="checkbox" checked={this.state.areyouinthissubgroup} name="areyouinthissubgroup" onChange={(e) => {
                                this.setState({
                                    [e.target.name]: e.target.checked
                                })
                            }}/>
                            Yes
                        </label>
                     </div>
                     <Adduserssubgroup groupid={this.props.groupid} array={this.state.subgroupaddedmembers}/>
                     <div className="button-padding">
                      <button className="button-submit" onClick={() => {
                          const data = {
                              subgroupname: this.state.subgroupname,
                              subgroupdescription: this.state.subgroupdescription,
                              subgroupmembers: this.state.subgroupaddedmembers,
                              subgroupid: generateId(41),
                              subgrouppost: generateId(42),
                              subboxfiler: generateId(43),
                              subchat: generateId(44),
                              areyouinthissubgroup: this.state.areyouinthissubgroup,
                              maingroupapi: this.props.groupapi,
                              subgroupapi: generateId(38),
                              groupid: this.props.groupid,
                              grouptype: this.props.grouptype,
                              subid: this.props.subgroupid,
                              mainboxfilerid: this.props.mainboxfilerid,
                              maingroupname: this.props.groupname
                          }
                          
                          axios.put('https://vincobackend.herokuapp.com/api/subgroup/createsubggroup/' + this.props.grouptype + '/' + this.props.groupid  + '/' + this.props.subgroupid + '/' + firebase.auth().currentUser.uid, data,{
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json'
                            },
                        }).then(() => {
                            console.log('this worked')
                            this.setState({
                              subgroupmodal: false
                            })

                            this.fetchSubgroups()
                        }).catch((error) => {
                            console.log(error);
                        })

                      }}>CREATE SUBGROUP</button>
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


    render () {
        console.log(this.state);
        return (
            <div>
             <div className="float-right">
              <button className="button-submit-blue" onClick={() => {
                  this.setState({
                      subgroupmodal: true
                  })
              }}>CREATE SUBGROUP</button>
             </div>
             <h1>Subgroups</h1>
             <div className="input-container">
              <this.OutputSubgroups/>
             </div>
             <this.CreateSubGroup subgroupmodal={this.state.subgroupmodal}/>
            </div>
        )
    }
}

const Subgroup = ({subgroupcomp , groupname , groupid , subgroupid, grouptype , groupapi , mainboxfilerid}) => {
    if (subgroupcomp === true) {
        console.log('here')
        return (
            <div>
                <div className="group-page">
                  <Subgrouphome mainboxfilerid={mainboxfilerid} groupapi={groupapi} grouptype={grouptype} subgroupid={subgroupid} groupid={groupid} groupname={groupname}/>
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default Subgroup