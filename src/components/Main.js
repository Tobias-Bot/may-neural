import React from "react";
import bridge from "@vkontakte/vk-bridge";
import qs from "querystring";
import { Route, HashRouter, Switch, NavLink } from "react-router-dom";
// import Transition from "react-transition-group/Transition";

// import FindFriend from "./FindFriend";

import "../App.css";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerStyles: {},
    };

    this.token =
      "1cc15217534a491b2e5486ea6b31f92421c151f365a8e987272660177daa23538874e879e3cbf344f0415";
    this.group_id = 140403026;

    this.maxItems = 10000;

    this.getHeaderStyle = this.getHeaderStyle.bind(this);
    this.openMainApp = this.openMainApp.bind(this);

    this.loadProfileData = this.loadProfileData.bind(this);
    this.normalData = this.normalData.bind(this);
    this.normalizeData = this.normalizeData.bind(this);
  }

  componentDidMount() {
    this.loadProfileData();
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

  loadProfileData() {
    bridge
      .send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
          user_ids: 386458263,
          fields: `verified,sex,city,has_photo,has_mobile,contacts,site,education,status,occupation,
          relatives,relation,personal,connections,activities,interests,music,movies,tv,books,
          games,about,quotes,can_post,can_see_all_posts,can_see_audio,can_write_private_message,
          can_send_friend_request,screen_name,can_be_invited_group,counters`,
          v: "5.126",
          access_token: this.token,
        },
      })
      .then((r) => {
        this.normalData(r.response[0]);
      });
  }

  normalData(profile) {
    let normalData = [];

    normalData[0] = profile.about && profile.about.length ? 1 : 0;
    normalData[1] = profile.activities && profile.activities.length ? 1 : 0;
    normalData[2] = profile.bdate ? 1 : 0;
    normalData[3] = profile.books && profile.books.length ? 1 : 0;
    normalData[4] = profile.can_post;
    normalData[5] = profile.can_see_all_posts;
    normalData[6] = profile.can_see_audio;
    normalData[7] = profile.can_send_friend_request;
    normalData[8] = profile.can_write_private_message;
    normalData[9] = profile.connections ? 1 : 0;

    if (profile.counters) {
      if (profile.can_see_audio && profile.counters.audio) {
        let data = {
          X: profile.counters.audios,
          Xmin: 0,
          Xmax: this.maxItems,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[10] = this.normalizeData(data);
      } else {
        normalData[10] = 0;
      }

      if (profile.counters.photos) {
        let data = {
          X: profile.counters.photos,
          Xmin: 0,
          Xmax: this.maxItems,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[11] = this.normalizeData(data);
      } else {
        normalData[11] = 0;
      }

      if (profile.counters.friends) {
        let data = {
          X: profile.counters.friends,
          Xmin: 0,
          Xmax: this.maxItems,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[12] = this.normalizeData(data);
      } else {
        normalData[12] = 0;
      }
    }

    normalData[13] = profile.education && profile.education.university ? 1 : 0;
    normalData[14] = profile.games && profile.games.length ? 1 : 0;
    normalData[15] = profile.has_photo;
    normalData[16] = profile.interests && profile.interests.length ? 1 : 0;
    normalData[17] = profile.movies && profile.movies.length ? 1 : 0;
    normalData[18] = profile.music && profile.music.length ? 1 : 0;
    normalData[19] =
      profile.occupation &&
      profile.occupation.type &&
      profile.occupation.type.length
        ? 1
        : 0;

    if (profile.personal) {
      if (profile.personal.political) {
        let data = {
          X: profile.personal.political,
          Xmin: 1,
          Xmax: 9,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[20] = this.normalizeData(data);
      } else {
        normalData[20] = 0;
      }

      if (profile.personal.langs) {
        let data = {
          X: profile.personal.langs.length,
          Xmin: 1,
          Xmax: 50,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[21] = this.normalizeData(data);
      } else {
        normalData[21] = 0;
      }

      if (profile.personal.people_main) {
        let data = {
          X: profile.personal.people_main,
          Xmin: 1,
          Xmax: 6,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[22] = this.normalizeData(data);
      } else {
        normalData[22] = 0;
      }

      if (profile.personal.life_main) {
        let data = {
          X: profile.personal.life_main,
          Xmin: 1,
          Xmax: 8,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[23] = this.normalizeData(data);
      } else {
        normalData[23] = 0;
      }

      if (profile.personal.smoking) {
        let data = {
          X: profile.personal.smoking,
          Xmin: 1,
          Xmax: 5,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[24] = this.normalizeData(data);
      } else {
        normalData[24] = 0;
      }

      if (profile.personal.alcohol) {
        let data = {
          X: profile.personal.alcohol,
          Xmin: 1,
          Xmax: 5,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[25] = this.normalizeData(data);
      } else {
        normalData[25] = 0;
      }
    }

    normalData[26] = profile.quotes && profile.quotes.length ? 1 : 0;
    normalData[27] = profile.relatives && profile.relatives.id ? 1 : 0;

    if (profile.relation) {
      let data = {
        X: profile.relation,
        Xmin: 1,
        Xmax: 8,
        Dmin: 0,
        Dmax: 1,
      };

      normalData[28] = this.normalizeData(data);
    } else {
      normalData[28] = 0;
    }

    if (profile.sex) {
      let data = {
        X: profile.sex,
        Xmin: 1,
        Xmax: 2,
        Dmin: 0,
        Dmax: 1,
      };

      normalData[30] = this.normalizeData(data);
    } else {
      normalData[29] = 0;
    }

    normalData[30] = profile.status && profile.status.length ? 1 : 0;
    normalData[31] = profile.verified;

    console.log(normalData);
  }

  normalizeData(data) {
    return (
      ((data.X - data.Xmin) * (data.Dmax - data.Dmin)) /
        (data.Xmax - data.Xmin) +
      data.Dmin
    );
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
          <HashRouter>
            <Switch>
              {/* <Route exact path="/friend">
                <FindFriend />
              </Route> */}
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
