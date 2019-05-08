//This will render after the game has started and will redirect to
//PictureDisplays after the timer or after pictures have been submitted

import { db } from "../../index";
import React, { Component } from "react";

export default class PromptScreen extends Component {
  constructor() {
    super();
    this.state = {
      game: {},
      roomNumber: "",
      judge: "",
      players: [],
      prompt: ""
    };
  }

  async componentDidMount() {
    const { game, roomNumber, judge, players } = this.props.location.state;
    this.setState({ game, roomNumber, judge, players });

    const room = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
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

  render() {
    const { judge, prompt } = this.state;
    if ((prompt = "")) {
      //remember to reset prompt after round end
      return (
        <div>
          <h1>Waiting for {judge} to select a prompt...</h1>
        </div>
      );
    }
    return (
      <div>
        <h1>Inside prompt screen</h1>
      </div>
    );
  }
}
