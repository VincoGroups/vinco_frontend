import React from 'react';

class SubchatComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalopened: false
    }
  }

  ShowSubCreateModal = ({modalopened}) => {
    if (modalopened === true) {
      return (
        <div>
          <div className="modal-edu">
           <div className="container">
            <div className="modal-padding">
              <div className="modal-blue-container">
                <span className="closebtnwhite">&times;</span>
                <h3>Create a Sub Group</h3>
                <div className="input-container">

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

  render() {
    return (
      <div>
       <div className="container">
       <div className="float-right">
          <button className="button-submit">CREATE A SUBGROUP</button>
        </div>
        <h2>SUBCHATS</h2>
        <h6>Here create sub-teams where you guys can work in a more specific collective</h6>
       </div>
      </div>
    )
  }
}


const Subchats = ({subchat}) => {
    if (subchat === true) {
        return(
            <div>
              <div className="subchats">
                <SubchatComponent/>
              </div>
            </div>
        )
    } else {
        return null;
    }
}

export default Subchats;