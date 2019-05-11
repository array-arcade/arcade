import React from 'react';
import { db } from '../../index';
import Button from '@material-ui/core/Button';
import VolumeUp from '@material-ui/icons/VolumeUp';

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
    let player = room.collection('users').doc(`${user.name}`);
    this.playerUnsub = player.onSnapshot(snapshot => {
      currentPlayer = snapshot.data();
      this.setState({ user: currentPlayer });
    });
    this.setState({ roomNum, game: currentGame });
    this.roomUnsub = room.onSnapshot(snapshot => {
      let doc = snapshot.data();
      if (doc.judgeChange) {
        this.setState({ pageChange: true });
        player.update({ image: null, refNum: null });
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
        return (
          <div className="h1Mobile">
            <h1>Welcome to the waiting room.</h1>
            <div>
              <Button>
                Random Noise!
                <VolumeUp />
              </Button>
            </div>
          </div>
        );
      }
    };
    return <div>{roomRender()}</div>;
  }
}
