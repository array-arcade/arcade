//This will render after the game has started and will redirect to
//PictureDisplays after the timer or after pictures have been submitted

import { db } from '../../index';
import React, { Component } from 'react';
import FooterScore from '../Browser/ScoreDisplay';

const Timer = require("tiny-timer");

export default class PromptScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: {},
      roomNumber: '',
      judge: '',
      players: [],
      prompt: "",
      time: 90
    };
  }

  async componentDidMount() {
    const { game, roomNumber, judge, players } = this.props.location.state;
    this.setState({ game, roomNumber, judge, players });

    const room = db
      .collection('games')
      .doc(`${game.name}`)
      .collection('rooms')
      .doc(`${roomNumber}`);

    this.unsubscribe = room.onSnapshot(snapshot => {
      const prompt = snapshot.data().prompt;
      if (prompt !== this.state.prompt) {
        this.setState({ prompt });
        this.render();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  TimesUp = () => {
    //update room timesup variable here
    const { game, roomNumber } = this.props.location.state;
    const room = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
      .doc(`${roomNumber}`);
    room.update({ TimesUp: true });
    //redirect code here
    return this.props.history.push({
      pathname: `/Like What You See?/${roomNumber}/choose`
    });
  };

  render() {
    const { judge, prompt } = this.state;
    if (prompt === "") {

      //remember to reset prompt after round end
      return (
        <div>
          <h1>Waiting for {judge} to select a prompt...</h1>
        </div>
      );
    } else {
      const timer = new Timer({ interval: 1000 });
      timer.on("tick", ms => {
        if (this.state.time > 0) {
          this.setState({ time: this.state.time - 1 });
        }
      });

      timer.on("done", ms => {
        this.TimesUp();
      });

      timer.start(90000);

      return (
        <div>
          <h1>{prompt}</h1>
          <h3>Get Drawing!!!</h3>
          <h1>{this.state.time}</h1>
        </div>
      );
    }
  }
}
