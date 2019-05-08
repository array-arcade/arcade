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
    this.state = {};
  }

  render() {
    return (
      <div>
        <h1>Inside prompt screen</h1>
      </div>
    );
  }
}
