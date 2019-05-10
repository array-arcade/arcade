import React, { Component } from "react";
import { withStyles, Card, CardContent, Typography } from "@material-ui/core";
import FooterScore from "../Browser/ScoreDisplay";
import CanvasDraw from "react-canvas-draw";

const styles = {

}

export default withStyles(styles)(
  class Winner extends Component {
    constructor() {
      super();
      this.state = {
        winner: {}
      };
    }

    render() {
      return (
        <div>
          <h1>We have a winner!</h1>
        </div>
      );
    }
  }
);
