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
      user: {},
      pageChange: false
    };
  }

  componentDidMount() {
    const { roomNum, currentGame, user } = this.props.location.state;
    console.log("inside waiting room mount", user);
    let currentPlayer;
    const room = db
      .collection("games")
      .doc(`${currentGame.name}`)
      .collection("rooms")
      .doc(`${roomNum}`);
    let player = room.collection("users").doc(`${user.name}`);
    this.playerUnsub = player.onSnapshot(snapshot => {
      currentPlayer = snapshot.data();
      this.setState({ user: currentPlayer });
    });
    this.setState({ roomNum, game: currentGame });
    this.roomUnsub = room.onSnapshot(snapshot => {
      let doc = snapshot.data();
      if (doc.judgeChange) {
        this.setState({ pageChange: true });
        player.update({ image: null, refNum: null })
      }
    });
  }

  componentWillUnmount() {
    this.playerUnsub();
    this.roomUnsub();
  }

  render() {
    const { roomNum, game, user, pageChange } = this.state;
    const roomRender = () => {
      console.log("inside room render waiting room", user);
      if (user.isJudge && pageChange) {
        return this.props.history.push({
          pathname: `/word-pick`,
          state: { roomNum, game, user }
        });
      } else if (pageChange) {
        return this.props.history.push({
          pathname: `/draw`,
          state: { roomNum, game, user }
        });
      } else {
        return <h1 className="Mobile">Welcome to the waiting room.</h1>;
      }
    };
    return <div>{roomRender()}</div>;
  }
}
