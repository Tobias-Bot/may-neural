import React from "react";
import bridge from "@vkontakte/vk-bridge";
import qs from "querystring";
import { Route, HashRouter, Switch, NavLink } from "react-router-dom";
// import Transition from "react-transition-group/Transition";

import Anima from "./Anima";

import "../App.css";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerStyles: {},
    };

    this.getHeaderStyle = this.getHeaderStyle.bind(this);
    this.openMainApp = this.openMainApp.bind(this);
  }

  getHeaderStyle() {
    const str = window.location.search.slice(1);
    const objParams = qs.parse(str);

    let platform = objParams.vk_platform;

    if (platform === "mobile_iphone") {
      return {
        header: {
          height: "70px",
          paddingTop: "30px",
        },
        headerLineBot: {
          top: "70px",
        },
        body: {
          top: "137px",
        },
      };
    } else {
      return {};
    }
  }

  openMainApp() {
    bridge.send("VKWebAppOpenApp", { app_id: 7646928 });
  }

  render() {
    let styles = this.getHeaderStyle();

    return (
      <div>
        <div className="Header" style={styles.header}>
          <span className="titleMark" onClick={this.openMainApp}>
            Мαú
          </span>{" "}
          <span className="titleApp">нейро</span>
          {/* <HashRouter>
            <NavLink className="linkStyle" to="/">
              <span className="headerBtn">
                <i className="fas fa-info-circle"></i>
              </span>
            </NavLink>
          </HashRouter> */}
        </div>

        <div
          id="contentWindow"
          className="Body"
          style={styles.body}
          onScroll={this.PostsLoader}
        >
          <Anima />
          <HashRouter>
            <Switch>
              <Route exact path="/anima">
                <Anima />
              </Route>
            </Switch>
          </HashRouter>
          <a href="https://vk.com/warmay" className="linkStyle">
            <div className="copyrightText">Май</div>
          </a>
        </div>
        {/* <div className="footer">
          <NavLink className="linkStyle" to="/search">
            <div className="btnFooter">
              <i className="fas fa-search"></i>
            </div>
          </NavLink>
        </div> */}
      </div>
    );
  }
}

export default Main;
