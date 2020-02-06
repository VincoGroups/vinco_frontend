import React, {useEffect, useState, useRef} from 'react';
import AuthNav from '../Authnav';
import axios from 'axios';
const ConnectionPage = (props) => {

    const [connectionresponse, setConnectionResponse] = useState({
        connectionresponse: []
    })
    
    const componentMounted = useRef(null);
    useEffect(() => {
     componentMounted.current = true;
        if (componentMounted.current) {
            if (props.match.params.connectionapi !== null) {
            axios.get('https://vincobackend.herokuapp.com/connection/fetchconnectioncredentials/' + props.match.params.connectionapi)
            .then((body) => {
                setConnectionResponse({
                    connectionresponse: body.data
                })
            }).catch((error) => {
                console.log(error)
            })
          }
         }

     return () => {componentMounted.current = false} 
    }, [props.match.params.connectionapi])

    console.log(connectionresponse.connectionresponse.connectionname);

    return (
     <div>
     <AuthNav/>
      <div className="page">
      <div className="connection-page">
       <div className="container">
        <h4>{connectionresponse.connectionresponse.connectionname}</h4>
        <div className="connection-navigation">
         <div className="float-left">
         <div className="row">
          <div className="col-md-4">
           <h5 className="text-center">POSTS</h5>
          </div>
          <div className="col-md-4">
           <h5 className="text-center">FILES</h5>
          </div>
          <div className="col-md-4">
           <h5 className="text-center">TEAMS</h5>
          </div>
         </div>
         </div>
        </div>
       </div>
      </div>
      </div>
     </div>
    )
}

export default ConnectionPage;