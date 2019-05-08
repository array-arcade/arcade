import React from "react";
import DrawPad from "./PlayerDrawPad";
import WordPick from "./JudgeWordPick";
import { db } from "../../index";

export class WaitingRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      roomNum: 0,
      game: {},
      user: {}
    };
  }

  componentDidMount() {
    const { roomNum, game, user } = this.props.location.state;
    const room = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
      .doc(`${roomNum}`);
    let currentPlayer = room.collection("users").doc(`${user}`);
    this.setState({ roomNum, game, user: currentPlayer });
  }

  render() {
    const { roomNum, game, user } = this.state;
    return (
      <div>
        <h1>inside the waiting room!</h1>
      </div>
    );
  }
}
