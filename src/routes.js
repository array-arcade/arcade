import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import PhoneHome from './PhoneHome';
import App from './App';
import DrawPad from './Like What You See/Phone/PlayerDrawPad';
import Lobby from './Lobby';
import WordPick from './Like What You See/Phone/JudgeWordPick';
import { WaitingRoom } from './Like What You See/Phone/WaitingRoom';
import PromptScreen from './Like What You See/Browser/PromptScreen';
import VictoryScreen from './Like What You See/Browser/VictoryScreen';
import PictureDisplays from './Like What You See/Browser/PictureDisplays';
import JudgeVote from './Like What You See/Phone/JudgeVote';

export default class Routes extends Component {
  render() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return (
        <Switch>
          <Route path="/vote" component={JudgeVote} />
          <Route path="/:roomNum/waitingroom" component={WaitingRoom} />
          <Route path="/draw" component={DrawPad} />
          <Route path="/join" component={PhoneHome} />
          <Route path="/word-pick" component={WordPick} />
          <Redirect from="/" to="join" />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path="/:game/:roomNum/lobby" component={Lobby} />
          <Route path="/:game/:roomNum/victory" component={VictoryScreen} />
          <Route path="/:game/:roomNum/prompt" component={PromptScreen} />
          <Route path="/:game/:roomNum/choose" component={PictureDisplays} />
          <Route path="/browse" component={App} />
          <Redirect from="/" to="browse" />
        </Switch>
      );
    }
  }
}
/*
Routes
Browser
Score Board //Can be a component


*/
