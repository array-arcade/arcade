//This will render after the game has started and will redirect to
//PictureDisplays after the timer or after pictures have been submitted

import { db } from "../../index";
import React, { Component } from "react";
import FooterScore from "../Browser/ScoreDisplay";
import Countdown from "react-countdown-now";

const song = require("../../SpanishFlea.mp3");

const flea = new Audio(song);

export default class PromptScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: {},
      roomNumber: "",
      judge: "",
      players: [],
      prompt: "",
      gifs: [
        "https://media.giphy.com/media/QvRwnp6tLmVk1A0jhM/giphy.gif",
        "https://media.giphy.com/media/MEF1VadKbQBdmd8LCn/giphy.gif",
        "https://media.giphy.com/media/esUOS8Ztwlifu/giphy.gif",
        "https://media.giphy.com/media/oT7ATDykMidsk/giphy.gif",
        "https://media.giphy.com/media/j9UHmOnjCNrIDZRoTe/giphy.gif",
        "https://media.giphy.com/media/8YvAXzOdUGGk7v6Qdx/giphy.gif",
        "https://media.giphy.com/media/l4HnKwiJJaJQB04Zq/giphy.gif",
        "https://media.giphy.com/media/ZXKZWB13D6gFO/giphy.gif",
        "https://media.giphy.com/media/jL43fSL8Zh5Vm/giphy.gif",
        "https://media.giphy.com/media/tGuD6xQ5K9spa/giphy.gif"
      ],
      gif: "",
      time: 60000
    };
  }

  async componentDidMount() {
    const { game, roomNumber, judge, players } = this.props.location.state;
    let submissionCounter = 0;
    let totalPlayers = 0;
    const randomGif = this.state.gifs[
      Math.floor(Math.random() * this.state.gifs.length)
    ];
    this.setState({
      game: game,
      gif: randomGif,
      roomNumber: roomNumber,
      judge: judge,
      players: players
    });
    const room = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
      .doc(`${roomNumber}`);
    await room.get().then(snapshot => {
      totalPlayers = snapshot.data().players;
    });
    const dbUsers = room.collection("users");
    this.usersUnsub = dbUsers.onSnapshot(snapshot => {
      snapshot.docs.forEach(user => {
        if (user.data().submitted) {
          submissionCounter++;
          if (submissionCounter === totalPlayers) {
            room.update({ submissions: true });
          }
        }
      });
    });
    this.roomUnsub = room.onSnapshot(snapshot => {
      let room = snapshot.data();
      const prompt = room.prompt;
      if (room.prompt) {
        this.setState({ prompt: room.prompt });
        flea.playbackRate = 1.0;
        flea.loop = true;
        flea.play();
      }
      if (room.submissions === true) {
        return this.props.history.push({
          pathname: `/Like What You See?/${roomNumber}/choose`,
          state: { game, roomNumber, players, prompt }
        });
      }
    });
  }

  componentWillUnmount() {
    this.usersUnsub();
    this.roomUnsub();
    clearInterval(this.interval);
    flea.pause();
  }

  TimesUp = async () => {
    //update room timesup variable here
    const { game, roomNumber, players, prompt } = this.state;
    const room = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
      .doc(`${roomNumber}`);
    room.update({ TimesUp: true });
    //redirect code here
    await room.get().then(snapshot => {
      if (snapshot.data.submissions === true) {
        return this.props.history.push({
          pathname: `/Like What You See?/${roomNumber}/choose`,
          state: { game, roomNumber, players, prompt }
        });
      }
    });
  };

  TimerRender = ({ minutes, seconds, milliseconds, completed }) => {
    return (
      <span>
        <h1>
          {minutes}:{seconds}
        </h1>
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
    if (prompt === "") {
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
          <h1 className="h1prompt">Like What You See?</h1>
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
