import React from "react";
import bridge from "@vkontakte/vk-bridge";
// import { Route, HashRouter, Switch, NavLink } from "react-router-dom";
// import Transition from "react-transition-group/Transition";

import features from "../data/features";

import "../App.css";
import "../styles/Feature.css";

class Anima extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultRages: [],

      showEditResults: false,
    };

    this.token =
      "bc673a3314c36d8dfa362adb6f12070f49bb225769b8ca2bd63873a6c289b2bc6f202848a6e59619bfb2f";
    this.group_id = 140403026;
    this.maxItems = 10000;

    this.hLen = 15;
    this.learningRate = 0.005;

    this.inputs = [];
    this.outputs = [];
    this.h1 = [];
    this.h2 = [];

    this.wInputs = [];
    this.wHidden = [];
    this.wOutputs = [];

    this.wInputsOffset = 0;
    this.wHiddenOffset = 0;
    this.wOutputsOffset = 0;

    this.loadProfileData = this.loadProfileData.bind(this);
    this.normalData = this.normalData.bind(this);
    this.normalizeData = this.normalizeData.bind(this);
    this.activateFun = this.activateFun.bind(this);
    this.setWeights = this.setWeights.bind(this);
    this.getWeights = this.getWeights.bind(this);
    this.calculateData = this.calculateData.bind(this);
    this.getRandom = this.getRandom.bind(this);
    this.getInterfaceEditResults = this.getInterfaceEditResults.bind(this);
    this.changeRangeValue = this.changeRangeValue.bind(this);
    this.backCalculateData = this.backCalculateData.bind(this);
    this.changeWeights = this.changeWeights.bind(this);
  }

  componentDidMount() {
    this.loadProfileData();

    // this.setWeights();
  }

  loadProfileData() {
    console.log(this.props.userId);
    bridge
      .send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
          user_ids: this.props.userId,
          fields: `sex,city,has_photo,has_mobile,contacts,education,status,occupation,
          relatives,relation,personal,connections,activities,interests,about,quotes
          can_post,can_see_all_posts,can_see_audio,can_write_private_message,
          can_send_friend_request,screen_name,can_be_invited_group,counters`,
          v: "5.126",
          access_token: this.token,
        },
      })
      .then((r) => {
        console.log(r.response[0]);
        this.normalData(r.response[0]);
        this.getWeights();
      });
  }

  normalData(profile) {
    let normalData = [];

    normalData[0] = profile.about && profile.about.length ? 1 : 0;
    normalData[1] = profile.bdate ? 1 : 0;
    normalData[2] = profile.can_write_private_message;

    if (profile.counters) {
      if (profile.can_see_audio && profile.counters.audio) {
        let data = {
          X: profile.counters.audios,
          Xmin: 0,
          Xmax: this.maxItems,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[3] = this.normalizeData(data);
      } else {
        normalData[3] = 0;
      }

      if (profile.counters.photos) {
        let data = {
          X: profile.counters.photos,
          Xmin: 0,
          Xmax: this.maxItems,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[4] = this.normalizeData(data);
      } else {
        normalData[4] = 0;
      }

      if (profile.counters.groups) {
        let data = {
          X: profile.counters.groups,
          Xmin: 0,
          Xmax: this.maxItems,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[5] = this.normalizeData(data);
      } else {
        normalData[5] = 0;
      }

      if (profile.counters.friends) {
        let data = {
          X: profile.counters.friends,
          Xmin: 0,
          Xmax: this.maxItems,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[6] = this.normalizeData(data);
      } else {
        normalData[6] = 0;
      }
    }

    normalData[7] = profile.education && profile.education.university ? 1 : 0;
    normalData[8] = profile.has_photo;
    normalData[9] = profile.interests && profile.interests.length ? 1 : 0;
    normalData[10] =
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

        normalData[11] = this.normalizeData(data);
      } else {
        normalData[11] = 0;
      }

      // if (profile.personal.langs) {
      //   let data = {
      //     X: profile.personal.langs.length,
      //     Xmin: 1,
      //     Xmax: 50,
      //     Dmin: 0,
      //     Dmax: 1,
      //   };

      //   normalData[12] = this.normalizeData(data);
      // } else {
      //   normalData[12] = 0;
      // }

      if (profile.personal.people_main) {
        let data = {
          X: profile.personal.people_main,
          Xmin: 1,
          Xmax: 6,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[12] = this.normalizeData(data);
      } else {
        normalData[12] = 0;
      }

      if (profile.personal.life_main) {
        let data = {
          X: profile.personal.life_main,
          Xmin: 1,
          Xmax: 8,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[13] = this.normalizeData(data);
      } else {
        normalData[13] = 0;
      }

      if (profile.personal.smoking) {
        let data = {
          X: profile.personal.smoking,
          Xmin: 1,
          Xmax: 5,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[14] = this.normalizeData(data);
      } else {
        normalData[14] = 0;
      }

      if (profile.personal.alcohol) {
        let data = {
          X: profile.personal.alcohol,
          Xmin: 1,
          Xmax: 5,
          Dmin: 0,
          Dmax: 1,
        };

        normalData[15] = this.normalizeData(data);
      } else {
        normalData[15] = 0;
      }
    } else {
      for (let i = 11; i < 16; i++) normalData[i] = 0;
    }

    if (profile.relation) {
      let data = {
        X: profile.relation,
        Xmin: 1,
        Xmax: 8,
        Dmin: 0,
        Dmax: 1,
      };

      normalData[16] = this.normalizeData(data);
    } else {
      normalData[16] = 0;
    }

    if (profile.sex) {
      let data = {
        X: profile.sex,
        Xmin: 1,
        Xmax: 2,
        Dmin: 0,
        Dmax: 1,
      };

      normalData[17] = this.normalizeData(data);
    } else {
      normalData[17] = 0;
    }

    normalData[18] = profile.status && profile.status.length ? 1 : 0;

    this.inputs = normalData;

    console.log(this.inputs);
  }

  normalizeData(data) {
    return (
      ((data.X - data.Xmin) * (data.Dmax - data.Dmin)) /
        (data.Xmax - data.Xmin) +
      data.Dmin
    );
  }

  activateFun(x) {
    return (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
  }

  setWeights() {
    // let inputs = [];
    // let hidden = [];
    // let outputs = [];

    let w = {
      i: "",
      h: "",
      o: "",
    };

    w.i = this.wInputs.map((w) => w.toFixed(2)).join(",");
    w.h = this.wHidden.map((w) => w.toFixed(2)).join(",");
    w.o = this.wOutputs.map((w) => w.toFixed(2)).join(",");

    // let wIn = 21 * this.hLen;
    // let wHid = this.hLen * this.hLen;
    // let wOut = this.hLen * 8;

    // for (let i = 0; i < wIn; i++) {
    //   inputs[i] = this.getRandom(-1, 1);
    // }

    // w.i = inputs.join(",");

    // for (let i = 0; i < wHid; i++) {
    //   hidden[i] = this.getRandom(-1, 1);
    // }

    // w.h = hidden.join(",");

    // for (let i = 0; i < wOut; i++) {
    //   outputs[i] = this.getRandom(-1, 1);
    // }

    // w.o = outputs.join(",");

    console.log(w);

    bridge.send("VKWebAppCallAPIMethod", {
      method: "groups.edit",
      params: {
        group_id: this.group_id,
        description: JSON.stringify(w),
        v: "5.126",
        access_token: this.token,
      },
    });
  }

  getWeights() {
    bridge
      .send("VKWebAppCallAPIMethod", {
        method: "groups.getById",
        params: {
          group_id: this.group_id,
          fields: "description",
          v: "5.126",
          access_token: this.token,
        },
      })
      .then((r) => {
        let w = JSON.parse(r.response[0].description);

        console.log(w);

        this.wInputs = w.i.split(",");
        this.wHidden = w.h.split(",");
        this.wOutputs = w.o.split(",");

        for (let i = 0; i < this.wInputs.length; i++) {
          this.wInputs[i] = parseFloat(this.wInputs[i]);
        }

        for (let i = 0; i < this.wHidden.length; i++) {
          this.wHidden[i] = parseFloat(this.wHidden[i]);
        }

        for (let i = 0; i < this.wOutputs.length; i++) {
          this.wOutputs[i] = parseFloat(this.wOutputs[i]);
        }

        this.calculateData();
      });
  }

  getRandom(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  calculateData() {
    let lenIn = this.inputs.length;
    let lenOut = features.length;
    let sum = 0;

    /* first hidden layer */
    for (let i = 0; i < this.hLen; i++) {
      for (let j = 0; j < lenIn; j++) {
        sum += this.inputs[j] * this.wInputs[j + this.wInputsOffset];
      }

      this.h1[i] = this.activateFun(sum);

      sum = 0;
      this.wInputsOffset += lenIn;
    }

    sum = 0;

    /* second hidden layer */
    for (let i = 0; i < this.hLen; i++) {
      for (let j = 0; j < this.hLen; j++) {
        sum += this.h1[j] * this.wHidden[j + this.wHiddenOffset];
      }

      this.h2[i] = this.activateFun(sum);

      sum = 0;
      this.wHiddenOffset += this.hLen;
    }

    this.wHiddenOffset = 0;

    let results = [];

    /* outputs layer */
    for (let i = 0; i < lenOut; i++) {
      for (let j = 0; j < this.hLen; j++) {
        sum += this.h2[j] * this.wOutputs[j + this.wHiddenOffset];
      }

      this.outputs[i] = this.activateFun(sum);

      let w = {
        X: this.outputs[i],
        Xmin: -1,
        Xmax: 1,
        Dmin: 0,
        Dmax: 100,
      };

      results[i] = this.normalizeData(w).toFixed(1);

      sum = 0;
      this.wHiddenOffset += this.hLen;
    }

    this.setState({ resultRages: results });
  }

  backCalculateData() {
    let trueResults = this.state.resultRages;
    let lenOut = this.outputs.length;
    let lenIn = this.inputs.length;

    this.wHiddenOffset = 0;
    this.wInputsOffset = 0;

    let err = [];
    let errH = [];
    let errI = [];

    let errSumH2 = [];
    let errSumH1 = [];

    for (let i = 0; i < this.hLen; i++) {
      errSumH1[i] = 0;
      errSumH2[i] = 0;
    }

    /* output layer */
    for (let i = 0; i < lenOut; i++) {
      let w = {
        X: trueResults[i],
        Xmin: 0,
        Xmax: 100,
        Dmin: -1,
        Dmax: 1,
      };

      err[i] =
        (this.outputs[i] - this.normalizeData(w)) *
        this.outputs[i] *
        (1 - this.outputs[i]);

      for (let j = 0; j < this.hLen; j++) {
        let dW = this.learningRate * err[i] * this.h2[j];

        this.wOutputs[j + this.wOutputsOffset] =
          this.wOutputs[j + this.wOutputsOffset] + dW;

        errSumH2[j] += err[i] * this.wOutputs[j + this.wOutputsOffset];
      }

      this.wOutputsOffset += this.hLen;
    }

    /* hidden layers */
    for (let i = 0; i < this.hLen; i++) {
      errH[i] = errSumH2[i] * this.h2[i] * (1 - this.h2[i]);

      for (let j = 0; j < this.hLen; j++) {
        let dW = this.learningRate * errH[i] * this.h1[j];

        this.wHidden[j + this.wHiddenOffset] =
          this.wHidden[j + this.wHiddenOffset] + dW;

        errSumH1[j] += errH[i] * this.wHidden[j + this.wHiddenOffset];
      }

      this.wHiddenOffset += this.hLen;
    }

    /* input layer */
    for (let i = 0; i < this.hLen; i++) {
      errI[i] = errSumH1[i] * this.h1[i] * (1 - this.h1[i]);

      for (let j = 0; j < lenIn; j++) {
        let dW = this.learningRate * errI[i] * this.inputs[j];

        this.wInputs[j + this.wInputsOffset] =
          this.wInputs[j + this.wInputsOffset] + dW;
      }

      this.wInputsOffset += this.hLen;
    }

    this.setWeights();
  }

  changeRangeValue(i, e) {
    let vals = this.state.resultRages;

    vals[i] = e.target.value;

    this.setState({ resultRages: vals });
  }

  getInterfaceEditResults() {
    let vals = this.state.resultRages;

    let ranges = features.map((feature, i) => {
      return (
        <div key={feature.color + i} className="rangePost">
          <div className="rangeTitle">
            {feature.title + " (" + vals[i] + ")"}
          </div>
          <div className="question">{feature.q}</div>
          <input
            type="range"
            className="form-range"
            min="0"
            max="100"
            step="5"
            value={vals[i] ? vals[i] : 0}
            onChange={(e) => this.changeRangeValue(i, e)}
          />
        </div>
      );
    });

    return ranges;
  }

  getInterfaceResults() {
    let vals = this.state.resultRages;

    let ranges = features.map((feature, i) => {
      return (
        <div key={feature.color + i} className="rangePost">
          <div className="rangeTitle">
            {feature.title + " (" + vals[i] + ")"}
          </div>
          <div className="question">{feature.text}</div>
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: vals[i] + "%", backgroundColor: feature.color }}
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      );
    });

    return ranges;
  }

  changeWeights() {
    let show = this.state.showEditResults;
    this.setState({ showEditResults: !show });

    this.backCalculateData();
  }

  render() {
    let show = this.state.showEditResults;
    let results = show
      ? this.getInterfaceEditResults()
      : this.getInterfaceResults();

    return (
      <div>
        <div className="infoText">Результаты анализа</div>
        <div className="cover">
          {!show ? (
            <div
              className="btnEdit"
              onClick={() => this.setState({ showEditResults: !show })}
            >
              <i className="far fa-edit"></i> редактировать
            </div>
          ) : (
            <div
              className="btnEdit"
              style={{ backgroundColor: "#1F1F33", color: "#D0D0FF" }}
              onClick={this.changeWeights}
            >
              сохранить
            </div>
          )}
          {results}
        </div>
      </div>
    );
  }
}

export default Anima;
