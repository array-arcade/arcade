import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { db } from '../../index';
import giphyRandom from 'giphy-random';
import { giphyKey } from '../../secrets';

const styles = {};

export default withStyles(styles)(
  class GameOver extends Component {
    constructor() {
      super();
      this.state = {
        game: {},
        roomNum: 0,
        user: {},
        gif: '',
      };
    }

    async componentDidMount() {
      let { data } = await giphyRandom(giphyKey, {
        tag: 'clapping',
        rating: 'pg',
      });
      const { roomNum, game, user } = this.props.location.state;
      this.setState({ roomNum, game, user, gif: data.image_url });
      const dbRoom = db
        .collection('games')
        .doc(`${game.name}`)
        .collection('rooms')
        .doc(`${roomNum}`);
      const dbUser = dbRoom.collection('users').doc(`${user.name}`);
      this.unsub = dbRoom.onSnapshot(snapshot => {
        let room = snapshot.data();
        if (room.restart) {
          dbUser.update({
            refNum: null,
            isJudge: false,
            score: 0,
            image: null,
            submitted: false
          });
          return this.props.history.push({
            pathname: `/${roomNum}/waitingroom`,
            state: { user, currentGame: game, roomNum },
          });
        }
        if (room.gameOver) {
          return this.props.history.push({ pathname: '/join' });
        }
      });
    }
    componentWillUnmount() {
      this.unsub();
    }

    render() {
      const { gif } = this.state;
      return (
        <div className="Mobile">
          <h1 className="WinnerH1">We have a winner!</h1>
          <div className="GifDiv">
            {gif ? (
              <img src={gif} alt="clap gif" />
            ) : (
              <img
                src="https://media.giphy.com/media/xUPGcMzwkOY01nj6hi/giphy.gif"
                alt="clap gif"
              />
            )}
          </div>
        </div>
      );
    }
  }
);
