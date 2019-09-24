import React from 'react';

class Subgrouphome extends React.Component {
    render () {
        return (
            <div>
             <div className="float-right">
              <button className="button-submit-blue">CREATE SUBGROUP</button>
             </div>
             <h1>{this.props.groupname + "s Subgroups"}</h1>
            </div>
        )
    }
}

const Subgroup = ({subgroupcomp , groupname}) => {
    if (subgroupcomp === true) {
        console.log('here')
        return (
            <div>
              <div className="subgroups-page">
              <Subgrouphome groupname={groupname}/>
              </div>
            </div>
        )
    } else {
        return null;
    }
}

export default Subgroup