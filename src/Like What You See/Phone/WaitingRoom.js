import React from 'react';
import DrawPad from './PlayerDrawPad';
import WordPick from './JudgeWordPick';
import { db } from '../../index';

export class WaitingRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      roomNum: 0,
      game: {},
      user: {},
      pageChange: false,
    };
  }

  componentDidMount() {
    const { roomNum, currentGame, user } = this.props.location.state;
    let currentPlayer;
    const room = db
      .collection('games')
      .doc(`${currentGame.name}`)
      .collection('rooms')
      .doc(`${roomNum}`);
    this.playerUnsub = room
      .collection('users')
      .doc(`${user}`)
      .onSnapshot(snapshot => {
        currentPlayer = snapshot.data();
        this.setState({ user: currentPlayer });
      });
    this.setState({ roomNum, game: currentGame });
    this.roomUnsub = room.onSnapshot(snapshot => {
      if (snapshot.data().judge) {
        this.setState({ pageChange: true });
      }
    });
  }

  componentWillUnmount() {
    this.playerUnsub();
    this.roomUnsub();
  }

  render() {
    const { roomNum, game, user, pageChange } = this.state;
    console.log(roomNum, game, user);
    const roomRender = () => {
      if (user.isJudge && pageChange) {
        return this.props.history.push({
          pathname: `/word-pick`,
          state: { roomNum, game, user },
        });
      } else if (pageChange) {
        return this.props.history.push({
          pathname: `/draw`,
          state: { roomNum, game, user },
        });
      } else {
        return <h1>Welcome to the waiting room.</h1>;
      }
    };
    return <div className="Mobile">{roomRender()}</div>;
  }
}
