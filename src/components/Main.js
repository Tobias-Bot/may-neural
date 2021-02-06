import React from "react";
import bridge from "@vkontakte/vk-bridge";
import qs from "querystring";
import { Route, HashRouter, Switch, NavLink } from "react-router-dom";
// import Transition from "react-transition-group/Transition";

import Anima from "./Anima";

import "../App.css";
import "../styles/Friends.css";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerStyles: {},
      friends: [],

      friendsLoad: true,
    };

    this.friendId = "";

    this.getHeaderStyle = this.getHeaderStyle.bind(this);
    this.openMainApp = this.openMainApp.bind(this);
    this.getFriends = this.getFriends.bind(this);
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

  getFriends() {
    this.setState({ friendsLoad: true });

    bridge
      .send("VKWebAppGetAuthToken", {
        app_id: 7706189,
        scope: "friends",
      })
      .then((r) => {
        let token = r.access_token;

        bridge
          .send("VKWebAppCallAPIMethod", {
            method: "friends.get",
            request_id: this.currOffset,
            params: {
              fields: "nickname,photo_50,online",
              order: "random",
              name_case: "nom",
              v: "5.76",
              access_token: token,
            },
          })
          .then((r) => {
            let items = [];

            items = r.response.items.map((friend) => {
              return !friend.deactivated ? (
                <div className="profile" key={friend.id}>
                  <img
                    className="profilePhoto"
                    src={friend.photo_50}
                    alt="avatar"
                  />
                  <br />
                  <div className="profileName">{friend.first_name}</div>
                </div>
              ) : (
                ""
              );
            });

            this.setState({ friends: items, friendsLoad: false });
          });
      });
  }

  render() {
    let styles = this.getHeaderStyle();

    let isShow = this.state.friendsLoad;
    let friends = this.state.friends;

    return (
      <div>
        <div
          className="modal fade"
          id="friendsModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Выбрать профиль</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="Loading" hidden={!isShow}>
                  <div className="spinner-border" role="status"></div>{" "}
                  <span className="LoadingText">секундочку...</span>
                </div>
                {friends}
              </div>
              <div className="modal-footer">
                <div className="mainBtn" data-dismiss="modal">
                  <i className="fas fa-puzzle-piece"></i> провести анализ
                </div>
              </div>
            </div>
          </div>
        </div>

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
          <HashRouter>
            <Switch>
              <Route exact path="/">
                <div className="row mt-4 mb-2 pl-2 pr-2">
                  <div className="col">
                    <div className="icon">
                      <i className="fas fa-share-square"></i>
                      <span className="iconTitle">мой профиль</span>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className="icon"
                      data-toggle="modal"
                      data-target="#friendsModal"
                      onClick={this.getFriends}
                    >
                      <i className="fas fa-user-friends"></i>
                      <span className="iconTitle">профиль друга</span>
                    </div>
                  </div>
                </div>
              </Route>
              <Route exact path="/anima">
                <Anima user_id={this.friendId} />
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
