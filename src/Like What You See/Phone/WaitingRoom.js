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
    const { roomNum, currentGame, user } = this.props.location.state;
    let currentPlayer = {}
    const room = db
      .collection("games")
      .doc(`${currentGame.name}`)
      .collection("rooms")
      .doc(`${roomNum}`);
    this.playerUnsub = room.collection("users").doc(`${user}`).onSnapshot(snapshot => {
      currentPlayer = snapshot.data()
    });
    this.setState({ roomNum, game: currentGame, user: currentPlayer });
    
  }

  render() {
    const { roomNum, game, user } = this.state;
    console.log(roomNum, game, user)
    return (
      <div>
        <h1>inside the waiting room!</h1>
      </div>
    );
  }
}
