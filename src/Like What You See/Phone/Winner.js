import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';

const styles = {};

export default withStyles(styles)(
  class Winner extends Component {
    constructor() {
      super();
      this.state = {
        winner: {},
      };
    }

    render() {
      return (
        <div>
          <h1>We have a winner!</h1>
          <img src="https://media.giphy.com/media/6brH8dM3zeMyA/giphy.gif" />
        </div>
      );
    }
  }
);
