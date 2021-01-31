import React from "react";
import bridge from "@vkontakte/vk-bridge";
// import { Route, HashRouter, Switch, NavLink } from "react-router-dom";
// import Transition from "react-transition-group/Transition";

import Post from "./Post";

import "../App.css";

class FindFriend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: this.props.posts,

      show: false,
      postsLoad: true,

      city: "",
      text: "",
      ps: "",
      whoIsText: "",
      zz: "",
      age: 0,
      music: "",
    };

    this.offset = 20;
    this.currOffset = 0;

    this.group_id = 140403026;
    this.post_id = this.props.data.post_id;
    this.lastComm = 0;

    this.getPosts = this.getPosts.bind(this);
    this.loadPosts = this.loadPosts.bind(this);
    this.getRandom = this.getRandom.bind(this);
    this.setModalForm = this.setModalForm.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.updatePosts = this.updatePosts.bind(this);
    this.shareTopic = this.shareTopic.bind(this);
  }

  componentDidMount() {
    this.setState({ show: true });

    this.updatePosts();
    //this.loadPosts();
    //this.props.startLoad();
  }

  componentWillUnmount() {
    this.setState({ show: false });
  }

  componentDidUpdate() {
    if (this.props.load) {
      this.loadPosts();
      this.props.stopLoad();
    }
  }

  loadPosts() {
    bridge
      .send("VKWebAppGetAuthToken", {
        app_id: 7738603,
        scope: "wall",
      })
      .then((data) => {
        let token = data.access_token;

        bridge
          .send("VKWebAppCallAPIMethod", {
            method: "wall.getComments",
            params: {
              owner_id: "-" + this.group_id,
              post_id: this.post_id,
              start_comment_id: this.lastComm,
              count: this.offset,
              sort: "desc",
              v: "5.126",
              access_token: token,
            },
          })
          .then((r) => {
            let comms = r.response.items;
            let posts = [];

            for (let i = 0; i < comms.length; i++) {
              let post = {};
              let postData = JSON.parse(comms[i].text);

              post.id = comms[i].id;
              post.text = postData.form;

              post.name = postData.user.name;
              post.url = postData.user.url;
              post.user_id = postData.user.id;
              post.photo = postData.user.photo;

              posts.push(post);

              if (i === comms.length - 1) {
                this.lastComm = comms[i].id - 1;
              }
            }

            this.setState(
              {
                posts: [...this.state.posts, ...posts],
                postsLoad: false,
              },
              () => {
                this.props.setPosts(this.state.posts);
              }
            );
          })
          .catch((e) => {
            console.log("it's ok");
          });
      });

    this.currOffset += this.offset;
  }

  getRandom(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);

    return Math.round(rand);
  }

  getPosts() {
    let response = this.props.posts.map((post, i) => {
      return (
        <Post key={i} data={post} index={i} color={this.props.data.color} />
      );
    });

    return response;
  }

  updatePosts() {
    //let posts = [];

    this.lastComm = 0;
    this.setState({ posts: [] }, () => {
      this.props.setPosts(this.state.posts);
    });

    this.loadPosts();
  }

  saveForm() {
    let formData = {
      "О себе": this.state.text,
      "Ищу тебя": this.state.whoIsText,
      Ps: this.state.ps,
      Город: this.state.city,
      "Знак зодиака": this.state.zz,
      Возраст: this.state.age,
      "Любимая песня": this.state.music,
    };

    let dirty = this.state.text.length > 0;

    this.props.onSubmitForm(formData, this.post_id, dirty);
  }

  setModalForm() {
    let form = (
      <div className="postForm">
        <textarea
          className="inputText"
          placeholder="Расскажи о себе: интересы, хобби, сериалы, музыка (кратко)"
          rows="5"
          onChange={(e) =>
            this.setState({ text: e.target.value }, this.saveForm)
          }
        ></textarea>
        <textarea
          className="inputText"
          placeholder="Опиши, кого хочешь найти (кратко)"
          rows="3"
          onChange={(e) =>
            this.setState({ whoIsText: e.target.value }, this.saveForm)
          }
        ></textarea>
        <input
          className="inputStr"
          placeholder="P.S."
          onChange={(e) => this.setState({ ps: e.target.value }, this.saveForm)}
        />
        <br />
        <div className="inputTitle">Кое-что еще (необязательно)</div>
        <input
          className="inputStr"
          placeholder="Укажи свой город"
          onChange={(e) =>
            this.setState({ city: e.target.value }, this.saveForm)
          }
        />
        <input
          className="inputStr"
          placeholder="Знак зодиака"
          onChange={(e) => this.setState({ zz: e.target.value }, this.saveForm)}
        />
        <input
          className="inputStr"
          placeholder="Возраст"
          onChange={(e) =>
            this.setState({ age: e.target.value }, this.saveForm)
          }
        />
        <input
          className="inputStr"
          placeholder="Любимая песня"
          onChange={(e) =>
            this.setState({ music: e.target.value }, this.saveForm)
          }
        />
      </div>
    );

    let styles = {
      color: this.props.data.color,
    };

    this.props.onSetForm(form, styles);
  }

  shareTopic() {
    bridge.send("VKWebAppShare", {
      link: "https://vk.com/app7738603#" + this.props.data.url,
    });
  }

  render() {
    let posts = this.getPosts();
    let color = this.props.data.color;
    let info = this.props.data.description;
    let isShow = this.state.postsLoad;

    return (
      <div>
        <div className="infoText">{info}</div>
        <div
          className="shareTopicBtn"
          style={{ backgroundColor: color }}
          onClick={this.shareTopic}
        >
          поделиться
        </div>
        <br />
        {/* <div
          className="shareTopicBtn"
          style={{
            backgroundColor: color,
            border: "3px solid rgba(0, 0, 0, 0.5)",
          }}
          onClick={}
        >
          удалить мою запись
        </div> */}

        <div className="Loading" hidden={!isShow}>
          <div
            className="spinner-border"
            style={{ color: color }}
            role="status"
          ></div>{" "}
          <span className="LoadingText" style={{ color: color }}>
            секундочку...
          </span>
        </div>

        {posts}

        <div className="topicFooter" style={{ borderColor: color }}>
          <div
            className="postBtn"
            style={{ color: color, borderColor: color }}
            onClick={this.updatePosts}
          >
            <i className="fas fa-redo-alt"></i>
          </div>
          <div
            className="postBtn"
            style={{ color: color, borderColor: color }}
            data-toggle="modal"
            data-target="#postModal"
            onClick={this.setModalForm}
          >
            <i className="fas fa-pencil-alt"></i>
          </div>
        </div>
      </div>
    );
  }
}

export default FindFriend;
