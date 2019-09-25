import React from 'react';
import Authnav from '../Authnav';

class SubHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subres: []
        }
    }

    componentDidMount() {
      const {mainapi} = this.props.match.params;
      const {subapi} = this.props.match.params;

      console.log(mainapi);
      console.log(subapi);
    }

    render() {
        return (
            <div>
              <Authnav/>
              <div className="page">
               <h1>SUBGROUP</h1>
              </div>
            </div>
        )
    }
}

export default SubHome;