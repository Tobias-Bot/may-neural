import React from "react";
import { HashRouter, NavLink } from "react-router-dom";
// import Transition from "react-transition-group/Transition";

import "../styles/Friends.css";
import "../App.css";

class FriendProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let photo = this.props.src;
    let name = this.props.name;
    let online = this.props.online ? "online" : "";
    let userId = this.props.id;

    return (
      <div className="profile" onClick={() => this.props.onIconClick(userId)}>
        <img className="profilePhoto" src={photo} alt="avatar" />
        <div className="profileName">{name}</div>
        <div className="profileOnline">{online}</div>
        <HashRouter>
          <NavLink className="linkStyle" to="/anima">
            <div className="profileBtn">
              <i className="fas fa-play"></i>
            </div>
          </NavLink>
        </HashRouter>
      </div>
    );
  }
}

export default FriendProfile;
