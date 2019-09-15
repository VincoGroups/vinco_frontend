import React from 'react';
import Nav from './Comps/Nav';

class Home extends React.Component {
    render() {
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
}

export default Home;