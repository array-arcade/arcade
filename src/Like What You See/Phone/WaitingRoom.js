import React from "react";
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
    let currentPlayer = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
      .doc(`${roomNum}`)
      .collection("users")
      .doc(`${user}`);
    this.setState({ roomNum, game, user: currentPlayer });
  }

  componentWillUpdate() {
    console.log(this.state, this.props);
  }

  render() {
    console.log(this.state)
    const { roomNum, game, user } = this.state;
    return (
      <div>
        <h1>inside the waiting room!</h1>
      </div>
    );
  }
}
