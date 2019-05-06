import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import PhoneHome from './PhoneHome';
import App from './App';
import PictionaryHome from './Game-Pic';
import GameHome from "./GameHome";

export default class Routes extends Component {
  render() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return (
        <Switch>
          <Route path="/room" component={PictionaryHome} />
          <Route path="/join" component={PhoneHome} />
          <Redirect from="/" to="join" />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path="/game" component={GameHome} />
          <Route path="/browse" component={App} />
          <Redirect from="/" to="browse" />
        </Switch>
      );
    }
  }
}
