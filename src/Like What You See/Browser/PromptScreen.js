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
      prompt: undefined,
      time: 90,
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
      if (prompt !== undefined) {
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
<<<<<<< HEAD
=======
      state: { game, roomNumber, players, prompt },
>>>>>>> master
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
    if (prompt === undefined) {
      //remember to reset prompt after round end
<<<<<<< HEAD
      console.log('***prompt empty code', prompt);
      return (
        <div className="App">
          <div>
            <h1>Waiting for {judge} to select a prompt...</h1>
          </div>
        </div>
      );
    } else {
      console.log('***prompt selected code', prompt);

=======
      return (
        <div>
          <h1>Waiting for {judge} to select a prompt...</h1>
          <FooterScore players={players} roomNumber={roomNumber} />
        </div>
      );
    } else {
>>>>>>> master
      return (
        <div className="App">
          <h1 textAlign={'center'}>{prompt}</h1>
          <h3 textAlign={'center'}>Get Drawing!!!</h3>
          <Countdown
            date={Date.now() + 90000}
            intervalDelay={0}
            precision={3}
            renderer={this.TimerRender}
            onComplete={this.TimesUp}
          />
          <FooterScore />
        </div>
      );
    }
  }
}
