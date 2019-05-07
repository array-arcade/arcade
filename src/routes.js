import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router";
import PhoneHome from "./PhoneHome";
import App from "./App";
import PictionaryHome from "./Game-Pic";
import Lobby from "./Lobby";
import WordPick from './Like What You See/Phone/JudgeWordPick'
import {WaitingRoom} from './Like What You See/Phone/WaitingRoom'

export default class Routes extends Component {
  render() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return (
        <Switch>
          <Route path="/:roomNum/waitingroom" component={WaitingRoom} />
          <Route path="/room" component={PictionaryHome} />
          <Route path="/join" component={PhoneHome} />
          <Route path='/word-pick' component={WordPick} />
          <Redirect from="/" to="join" />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path="/lobby" component={Lobby} />
          <Route path="/browse" component={App} />
          <Redirect from="/" to="browse" />
        </Switch>
      );
    }
  }
}
