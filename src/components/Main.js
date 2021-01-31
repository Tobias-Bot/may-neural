import React from "react";
import bridge from "@vkontakte/vk-bridge";
import qs from "querystring";
import { Route, HashRouter, Switch, NavLink } from "react-router-dom";
// import Transition from "react-transition-group/Transition";

import topics from "../data/topics";
import InfoPage from "./InfoPage";
import FindFriend from "./FindFriend";
import WatchFilm from "./WatchFilm";
import TalkToMe from "./TalkToMe";
import PlayGames from "./PlayGames";
import GoWalk from "./GoWalk";
import Ask from "./Ask";

import "../App.css";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      headerStyles: {},
      modalForm: <div></div>,
      modalStyles: {},

      show: false,

      submitUserForm: {
        id: "",
        name: "",
        photo: "",
        url: "",
      },
      submitUserData: {},

      formValid: false,

      load: false,
      scroll: false,
    };

    this.topic_id = 0;

    this.token =
      "1cc15217534a491b2e5486ea6b31f92421c151f365a8e987272660177daa23538874e879e3cbf344f0415";
    this.group_id = 140403026;

    this.submitUserPost = this.submitUserPost.bind(this);
    this.getHeaderStyle = this.getHeaderStyle.bind(this);
    this.showAnimation = this.showAnimation.bind(this);
    this.setModalForm = this.setModalForm.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.stopLoad = this.stopLoad.bind(this);
    this.startLoad = this.startLoad.bind(this);
    this.PostsLoader = this.PostsLoader.bind(this);
    this.openMainApp = this.openMainApp.bind(this);
  }

  componentDidMount() {
    this.setState({ headerStyles: this.getHeaderStyle() });

    this.showAnimation();
  }

  showAnimation() {
    this.setState({ show: true });
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

  getTopics() {
    let response = topics.map((topic, i) => {
      return (
        <NavLink key={i} className="linkStyle" to={topic.url}>
          <div className="btnInfo" style={{ backgroundColor: topic.color }}>
            <i className={topic.icon}></i> {topic.title}
          </div>
        </NavLink>
      );
    });

    return response;
  }

  setModalText(text) {
    this.setState({ testInfo: text });
  }

  setModalForm(form, style) {
    this.setState({ modalForm: form, modalStyles: style });
    this.getUserData();
  }

  saveForm(formData, topic_id, dirty) {
    this.topic_id = topic_id;
    this.setState({ submitUserData: formData, formValid: dirty });
  }

  getUserData() {
    bridge.send("VKWebAppGetUserInfo").then((r) => {
      this.setState({
        submitUserForm: {
          id: r.id,
          name: r.first_name,
          photo: r.photo_100,
          url: `https://vk.com/id${r.id}`,
        },
      });
    });
  }

  submitUserPost() {
    let mes = {
      form: this.state.submitUserData,
      user: this.state.submitUserForm,
    };

    bridge
      .send("VKWebAppCallAPIMethod", {
        method: "wall.createComment",
        params: {
          owner_id: "-" + this.group_id,
          post_id: this.topic_id,
          message: JSON.stringify(mes),
          from_group: this.group_id,
          v: "5.126",
          access_token: this.token,
        },
      })
      .then((r) => {
        let post = {};
        let posts = this.state.posts;

        post.id = r.response.comment_id;
        post.text = mes.form;

        post.name = mes.user.name;
        post.url = mes.user.url;
        post.user_id = mes.user.id;
        post.photo = mes.user.photo;

        posts.unshift(post);

        this.setState({ posts, modalForm: <div></div> });
      });
  }

  stopLoad() {
    this.setState({ load: false });
  }

  startLoad() {
    this.setState({ scroll: true });
  }

  PostsLoader() {
    let content = document.getElementById("contentWindow");

    let H = content.scrollHeight;
    let currH = content.scrollTop;

    this.currPercent = (100 * currH) / (H - 700);

    if (this.currPercent <= 70) {
      this.startLoad();
    }

    if (this.state.scroll) {
      if (this.currPercent >= 70) {
        this.setState({ load: true, scroll: false });
      }
    }
  }

  openMainApp() {
    bridge.send("VKWebAppOpenApp", { app_id: 7646928 });
  }

  render() {
    let styles = this.state.headerStyles;
    let form = this.state.modalForm;
    let tabs = this.getTopics();
    let formValid = this.state.formValid;

    let bar = <HashRouter>{tabs}</HashRouter>;

    return (
      <div>
        <div
          className="modal fade"
          id="postModal"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div
              className="modal-content"
              style={{ backgroundColor: this.state.modalStyles.color }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Опубликовать запись</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{form}</div>
              <div className="modal-footer">
                <div
                  className="submitBtn"
                  data-dismiss="modal"
                  hidden={!formValid}
                  onClick={this.submitUserPost}
                >
                  опубликовать
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="Header" style={styles.header}>
          <span className="titleMark" onClick={this.openMainApp}>
            Мαú
          </span>{" "}
          <span className="titleApp">френдс</span>
          <HashRouter>
            <NavLink className="linkStyle" to="/">
              <span className="headerBtn">
                <i className="fas fa-info-circle"></i>
              </span>
            </NavLink>
          </HashRouter>
        </div>

        <div className="headerLineBot" style={styles.headerLineBot}>
          {bar}
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
                <InfoPage />
              </Route>
              <Route exact path="/friend">
                <FindFriend
                  data={topics[0]}
                  posts={this.state.posts}
                  setPosts={(posts) => this.setState({ posts })}
                  onSetForm={this.setModalForm}
                  onSubmitForm={this.saveForm}
                  load={this.state.load}
                  stopLoad={this.stopLoad}
                  startLoad={this.startLoad}
                />
              </Route>
              <Route exact path="/film">
                <WatchFilm
                  data={topics[1]}
                  posts={this.state.posts}
                  setPosts={(posts) => this.setState({ posts })}
                  onSetForm={this.setModalForm}
                  onSubmitForm={this.saveForm}
                  load={this.state.load}
                  stopLoad={this.stopLoad}
                  startLoad={this.startLoad}
                />
              </Route>
              <Route exact path="/talk">
                <TalkToMe
                  data={topics[2]}
                  posts={this.state.posts}
                  setPosts={(posts) => this.setState({ posts })}
                  onSetForm={this.setModalForm}
                  onSubmitForm={this.saveForm}
                  load={this.state.load}
                  stopLoad={this.stopLoad}
                  startLoad={this.startLoad}
                />
              </Route>
              <Route exact path="/game">
                <PlayGames
                  data={topics[3]}
                  posts={this.state.posts}
                  setPosts={(posts) => this.setState({ posts })}
                  onSetForm={this.setModalForm}
                  onSubmitForm={this.saveForm}
                  load={this.state.load}
                  stopLoad={this.stopLoad}
                  startLoad={this.startLoad}
                />
              </Route>
              <Route exact path="/walk">
                <GoWalk
                  data={topics[4]}
                  posts={this.state.posts}
                  setPosts={(posts) => this.setState({ posts })}
                  onSetForm={this.setModalForm}
                  onSubmitForm={this.saveForm}
                  load={this.state.load}
                  stopLoad={this.stopLoad}
                  startLoad={this.startLoad}
                />
              </Route>
              <Route exact path="/ask">
                <Ask
                  data={topics[5]}
                  posts={this.state.posts}
                  setPosts={(posts) => this.setState({ posts })}
                  onSetForm={this.setModalForm}
                  onSubmitForm={this.saveForm}
                  load={this.state.load}
                  stopLoad={this.stopLoad}
                  startLoad={this.startLoad}
                />
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
