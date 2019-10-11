import React, {useEffect, useState, useRef} from 'react';
import AuthNav from '../Authnav';

const ConnectionPage = (props) => {

    const [connectionresponse, setConnectionResponse] = useState({
        connectionresponse: []
    })
    
    const componentMounted = useRef(null);
    useEffect(() => {
     componentMounted.current = true;
        if (componentMounted.current) {
            if (props.match.params.connectionapi !== null) {
            fetch('/connection/fetchconnectioncredentials/' + props.match.params.connectionapi)
            .then((res) => {
                return res.json();
            }).then((body) => {
                setConnectionResponse({
                    connectionresponse: body
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