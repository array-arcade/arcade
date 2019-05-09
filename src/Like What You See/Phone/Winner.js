import React, { Component } from "react";
import { withStyles } from "@material-ui/core";

const styles = {}

export default withStyles(styles)(
  class Winner extends Component {
    constructor() {
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
