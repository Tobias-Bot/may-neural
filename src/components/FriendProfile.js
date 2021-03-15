import React from "react";
// import { Route, HashRouter, Switch, NavLink } from "react-router-dom";
// import Transition from "react-transition-group/Transition";

import "../styles/Friends.css";

class FriendProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let photo = this.props.src;
    let name = this.props.name;
    let userId = this.props.id;

    return (
      <div className="profile" onClick={() => this.props.onIconClick(userId)}>
        <img className="profilePhoto" src={photo} alt="avatar" />
        <br />
        <div className="profileName">{name}</div>
      </div>
    );
  }
}

export default FriendProfile;
