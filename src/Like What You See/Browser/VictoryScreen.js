//This will display after a player has reached the score to win
//Can redirect either to the Lobby or the browser home depending
//on if the game is restarted or the room is destroyed

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { db } from '../../index'

export default class VictoryScreen extends Component {
  constructor() {
    super();
    this.state = {
      winner: {},
      roomNum: 0,
      game: {}
    };
  }

  componentDidMount() {
    const { winner, roomNum, game } = this.props.location.state
    this.setState({ winner, roomNum, game })
  }

  exitGame = () => {
    const { roomNum, game }  = this.state
    let deleteUsers = db
      .collection('games')
      .doc('Like What You See?')
      .collection('rooms');
    deleteUsers
      .doc(`${roomNum}`)
      .collection('users')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
    deleteUsers.doc(`${roomNum}`).delete();
  };

  render() {
    return (
      <div>
        <h1>Inside victory screen</h1>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth={true}
          onClick={() => this.exitGame()}
        >
          Leave Game
        </Button>
      </div>
    );
  }
}
