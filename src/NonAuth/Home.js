import React from 'react';
import Nav from './Comps/Nav';
import axios from 'axios'

const Home = () =>  {
    axios.get("https://vincobackend.herokuapp.com/testing/apptesting")
    .then(body => {
        console.log(body)
    }).catch((error) => {
        console.log(error)
    })
        return (
            <div>
             <Nav/>
             <div className="page">
              <div className="landing-page">
                <div className="container">
                <h1>VINCO</h1>
                </div>
              </div>
             </div>
            </div>
        )
}

export default Home;