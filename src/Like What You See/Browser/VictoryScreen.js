//This will display after a player has reached the score to win
//Can redirect either to the Lobby or the browser home depending
//on if the game is restarted or the room is destroyed

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';

export default class VictoryScreen extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleClick = () => {
    let db = firebase.firestore();
    let deleteUsers = db
      .collection('games')
      .doc('Like What You See?')
      .collection('rooms');
    deleteUsers
      .doc('1616')
      .collection('users')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
    deleteUsers.doc('1616').delete();
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
          onClick={() => this.handleClick()}
        >
          Leave Game
        </Button>
      </div>
    );
  }
}
