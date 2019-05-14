//This will render after the game has started and will redirect to
//PictureDisplays after the timer or after pictures have been submitted

import { db } from '../../index';
import React, { Component } from 'react';
import FooterScore from '../Browser/ScoreDisplay';
import Countdown from 'react-countdown-now';
import giphyRandom from 'giphy-random';
import { giphyKey } from '../../secrets';

const song = require('../../SpanishFlea.mp3');

const flea = new Audio(song);

export default class PromptScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: {},
      roomNumber: '',
      judge: '',
      players: [],
      prompt: '',
      gif: '',
      time: 60000,
    };
  }

  async componentDidMount() {
    const { game, roomNumber, judge, players } = this.props.location.state;
    let { data } = await giphyRandom(giphyKey, {
      tag: 'waiting',
      rating: 'pg',
    });
    this.setState({
      game: game,
      gif: data.image_url ? data.image_url : null,
      roomNumber: roomNumber,
      judge: judge,
      players: players,
    });
    const room = db
      .collection('games')
      .doc(`${game.name}`)
      .collection('rooms')
      .doc(`${roomNumber}`);
    this.unsubscribe = room.onSnapshot(snapshot => {
      let room = snapshot.data();
      const prompt = room.prompt;
      if (room.prompt) {
        this.setState({ prompt: room.prompt });
        flea.playbackRate = 1.0;
        flea.loop = true;
        flea.play();
      }
      if (room.submissions === players.length - 1) {
        return this.props.history.push({
          pathname: `/Like What You See?/${roomNumber}/choose`,
          state: { game, roomNumber, players, prompt },
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.interval);
    flea.pause();
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
    room.get().then(snapshot => {
      if (snapshot.data.submissions === players.length - 1) {
        return this.props.history.push({
          pathname: `/Like What You See?/${roomNumber}/choose`,
          state: { game, roomNumber, players, prompt },
        });
      }
    });
  };

  TimerRender = ({ minutes, seconds, milliseconds, completed }) => {
    return (
      <span>
        <h1>{seconds}</h1>
      </span>
    );
  };

  start = () => {
    this.interval = setInterval(() => {
      if (this.state.time <= 0) {
        return clearInterval(this.interval);
      } else if (this.state.time <= 5000) {
        flea.playbackRate = 2.0;
      } else if (this.state.time <= 10000) {
        flea.playbackRate = 1.75;
      } else if (this.state.time <= 15000) {
        flea.playbackRate = 1.5;
      } else if (this.state.time <= 20000) {
        flea.playbackRate = 1.25;
      }
      this.setState(prevState => ({ time: prevState.time - 1000 }));
    }, 1000);
  };

  render() {
    const { judge, prompt, players, roomNumber, time, gif } = this.state;
    if (prompt === '') {
      //remember to reset prompt after round end
      return (
        <div className="App">
          <h1>Waiting for {judge} to select a prompt...</h1>
          <div className="GifDiv">
            {gif ? <img src={gif} alt="cat gif" /> : null}
          </div>
          {this.state.roomNumber ? (
            <FooterScore players={players} roomNumber={roomNumber} />
          ) : (
            <h1>No state</h1>
          )}
        </div>
      );
    } else {
      return (
        <div className="App">
          <h1 textAlign="center">{prompt}</h1>
          <h3 textAlign="center">Get Drawing!!!</h3>
          <Countdown
            date={time}
            // intervalDelay={0}
            onMount={this.start}
            precision={3}
            renderer={this.TimerRender}
            onComplete={this.TimesUp}
            controlled={true}
          />
          <div className="GifDiv">
            {gif ? <img src={gif} alt="waiting gif" /> : null}
          </div>
          <FooterScore players={players} roomNumber={roomNumber} />
        </div>
      );
    }
  }
}
