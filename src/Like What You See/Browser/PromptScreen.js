//This will render after the game has started and will redirect to
//PictureDisplays after the timer or after pictures have been submitted

import { db } from '../../index';
import React, { Component } from 'react';
import FooterScore from '../Browser/ScoreDisplay';
import Countdown from 'react-countdown-now';

export default class PromptScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: {},
      roomNumber: '',
      judge: '',
      players: [],
      prompt: "",
      time: 90,
    };
  }

  async componentDidMount() {
    const { game, roomNumber, judge, players } = this.props.location.state;
    this.setState({ game: game, roomNumber: roomNumber, judge: judge, players: players });
    const room = db
      .collection('games')
      .doc(`${game.name}`)
      .collection('rooms')
      .doc(`${roomNumber}`);
    this.unsubscribe = room.onSnapshot(snapshot => {
      const prompt = snapshot.data().prompt;
      if (prompt) {
        this.setState({ prompt });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  TimesUp = () => {
    //update room timesup variable here
    const { game, roomNumber, players, prompt } = this.state;
    const room = db
      .collection('games')
      .doc(`${game.name}`)
      .collection('rooms')
      .doc(`${roomNumber}`);
    room.update({ TimesUp: true });
    //redirect code here
    return this.props.history.push({
      pathname: `/Like What You See?/${roomNumber}/choose`,
      state: {game, roomNumber, players, prompt}
    });
  };

  TimerRender = ({ minutes, seconds, milliseconds, completed }) => {
    return (
      <span>
        <h1>
          {minutes}:{seconds}:{milliseconds}
        </h1>
      </span>
    );
  };

  render() {
    const { judge, prompt, players, roomNumber } = this.state;
    if (prompt === "") {
      //remember to reset prompt after round end
      return (
        <div className="App">
          <h1>Waiting for {judge} to select a prompt...</h1>
          {
            this.state.roomNumber ? <FooterScore players={players} roomNumber={roomNumber} /> : <h1>No state</h1> 
          }
        </div>
      );
    } else {
      return (
        <div className="App">
          <h1 textAlign={'center'}>{prompt}</h1>
          <h3 textAlign={'center'}>Get Drawing!!!</h3>
          <Countdown
            date={Date.now() + 60000}
            intervalDelay={0}
            precision={3}
            renderer={this.TimerRender}
            onComplete={this.TimesUp}
          />
          <FooterScore players={players} roomNumber={roomNumber} />
        </div>
      );
    }
  }
}
