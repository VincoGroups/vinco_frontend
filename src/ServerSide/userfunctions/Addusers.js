import React, {useState , useEffect} from 'react';
import firebase from '../basefile';
import generateId from '../generate';
const Addusersfilter = ({cardstyle , buttonstyle , data , api}) => {

    const [allusers , setUsers] = useState({
        allusers: []
    })
    const [suggestionarray , setSuggestions] = useState({
        suggestions: []
    })

    const RenderSuggestions = () => {
        const {suggestions} = suggestionarray
        if (suggestions.length === 0) {
            return null
        }
        

        return (
            <div>
              {suggestions.map(item => (
                  <div key={generateId(10)}>
                    <div className={cardstyle}>
                      <div className="row">
                        <div className="col-md-10">
                          <h6>{item.email}</h6>
                          <h4>{item.firstname + ' ' + item.lastname}</h4>
                        </div>
                        <div className="col-md-2">
                         <div className="button-padding">
                          <button className={buttonstyle} onClick={() => {
                                fetch("/api/group/adduser/pending/" + api  + "/" +  item.useruid, {
                                  method: 'PUT',
                                  headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                                }).then(() => {
                                  console.log('this worked');
                                }).catch((error) => {
                                  console.log(error)
                              })
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

    useEffect(() => {
        setTimeout(() => {
        fetch('/user/getallusers')
        .then((res) => {
          return res.json();
        }).then((body) => {
          const newbody = body.filter(index => index.useruid !== firebase.auth().currentUser.uid)
          setUsers({
            allusers: newbody
          })
         }).catch((error) => {
          console.log(error)
        })
     }, 500);
    } , [])

    return (
        <div>
         <div className="input-container">
            <div className="group">      
             <input type="text" className="inputbar" name="searchvalue" onChange={(e) => {
                 let suggestions = [];
                 if (e.target.value.length > 0) {
                   const regex = new RegExp(`^${e.target.value}` , 'i');
                   suggestions = allusers.allusers.sort().filter(v => regex.test(v.firstname));
                  }
  
                  setSuggestions({
                      suggestions: suggestions
                  })
                 }} required />
                 <span className="highlight"></span>
                 <span className="bar"></span>
                 <label className="labelbar">People you want to add</label>
             </div>
            <RenderSuggestions/>
         </div>           
        </div>
    )
}

export default Addusersfilter;