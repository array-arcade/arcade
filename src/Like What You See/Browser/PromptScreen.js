//This will render after the game has started and will redirect to
//PictureDisplays after the timer or after pictures have been submitted

import {
  Card,
  CardMedia,
  CardContent,
  withStyles,
  Typography,
  Button
} from "@material-ui/core";
import firebase from "firebase/app";

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
    const { game, roomNumber, judge } = this.props.location.state;
    this.setState({ game, roomNumber, judge });
    let db = firebase.firestore();
    let users = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
      .doc(`${roomNumber}`)
      .collection("users");
    users.onSnapshot(snapshot => {
      let players = snapshot.docs.map(doc => doc.data());
      this.setState({ players: players });
    });
  }

  render() {
    return (
      <div>
        <h1>Inside prompt screen</h1>
      </div>
    );
  }
}
