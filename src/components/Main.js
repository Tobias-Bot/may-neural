import React from "react";
import bridge from "@vkontakte/vk-bridge";
import qs from "querystring";
import { Route, HashRouter, Switch, NavLink } from "react-router-dom";
// import Transition from "react-transition-group/Transition";

import Anima from "./Anima";
import FriendProfile from "./FriendProfile";

import "../App.css";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerStyles: {},
      friends: [],

      token: "",

      friendsLoad: true,
      friendId: 0,
      myId: 0,
    };

    this.getHeaderStyle = this.getHeaderStyle.bind(this);
    this.openMainApp = this.openMainApp.bind(this);
    this.getFriends = this.getFriends.bind(this);
    this.setUserId = this.setUserId.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.delUserId = this.delUserId.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
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

  setUserId(id) {
    this.setState({ friendId: id });
  }

  getFriends() {
    this.setState({ friendsLoad: true });

    bridge
      .send("VKWebAppGetAuthToken", {
        app_id: 7807196,
        scope: "friends,groups",
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
                <FriendProfile
                  key={friend.id}
                  id={friend.id}
                  online={friend.online}
                  src={friend.photo_50}
                  name={friend.first_name}
                  onIconClick={this.setUserId}
                />
              ) : (
                ""
              );
            });

            this.setState({ friends: items, friendsLoad: false, token });
          });
      });
  }

  getUserInfo() {
    bridge.send("VKWebAppGetUserInfo").then((r) => {
      this.setState({ myId: r.id });
    });
  }

  delUserId() {
    this.setState({ friendId: "" });
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
                  id="closeModal"
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
                <div className="infoText">Привет!</div>
                <div className="infoText">
                  Это приложение поможет тебе получить психологический портрет
                  пользователя по его профилю. В приложение встроена нейронная
                  сеть, которая и анализирует профили. Ты можешь обучать сеть,
                  чтобы результаты анализа были точнее. Попробуй!
                </div>
                <div className="btnsTitle">анализ</div>
                <div className="btnsBackground">
                  <div className="row mb-4">
                    <div className="col">
                      <NavLink className="linkStyle" to="/anima">
                        <div className="icon">
                          <i className="fas fa-user"></i>
                          <span className="iconTitle">мой профиль</span>
                        </div>
                      </NavLink>
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
                </div>
              </Route>
              <Route exact path="/anima">
                <Anima
                  userId={this.state.friendId}
                  myId={this.state.myId}
                  token={this.state.token}
                  resetUserId={this.delUserId}
                />
              </Route>
            </Switch>
          </HashRouter>
          <a
            href="https://vk.com/warmay"
            className="linkStyle"
            target="_blank"
            rel="noopener noreferrer"
          >
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
