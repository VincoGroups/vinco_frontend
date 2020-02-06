import React from 'react';
import firebase from '../../../../../ServerSide/basefile';
import {generateId} from '../../../../../ServerSide/functions';
import axios from 'axios';
class Adduserssubgroup extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      allusers: [],
      suggestions: []
    }
  }

  componentDidMount() {
    setTimeout(() => {
      axios.get('https://vincobackend.herokuapp.com/api/group/getgroupusers/' + this.props.groupid )
      .then((body) => {
        const newbody = body.data.users.filter(index => index !== firebase.auth().currentUser.uid)
        const bodyarray = []
        newbody.forEach((item) => {
          axios.get('https://vincobackend.herokuapp.com/api/group/getusers/' + item)
            .then((response) => {
               bodyarray.push(response.data);
            }).catch((error) => {
              console.log(error)
            })
        })
        this.setState({
          allusers: bodyarray
        })
       }).catch((error) => {
        console.log(error)
      })
   }, 500);
  }

     RenderSuggestions = () => {
        const {suggestions} = this.state
        if (suggestions.length === 0) {
            return null
        }
        return (
            <div>
              {suggestions.map(item => (
                  <div key={generateId(10)}>
                    <div className="suggest-card">
                      <div className="row">
                        <div className="col-md-10">
                          <h6>{item.email}</h6>
                          <h4>{item.firstname + ' ' + item.lastname}</h4>
                        </div>
                        <div className="col-md-2">
                         <div className="button-padding">
                          <button className="button-submit" onClick={() => {
                              this.props.array.push(item.useruid)
                          }}>ADD USER</button>
                         </div>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )
    }

    ManipulateInput = () => {
      return (
        <div>
          <div className="group">      
           <input type="text" className="inputbar" name="searchvalue" onChange={(e) => {
               let suggestions = [];
               if (e.target.value.length > 0) {
                 const {allusers} = this.state
                 const regex = new RegExp(`^${e.target.value}` , 'i');
                 suggestions = allusers.sort().filter(v => regex.test(v.firstname));
                }

                this.setState({
                    suggestions: suggestions
                })
               }} required />
               <span className="highlight"></span>
               <span className="bar"></span>
               <label className="labelbar">People you want to add</label>
           </div>
        </div>
      )
    }

    render() {
    console.log(this.state);
    return (
      <div>
       <div className="input-container">
          <this.ManipulateInput/>
          <this.RenderSuggestions/>
       </div>           
      </div>
  )
    }
}

export default Adduserssubgroup;