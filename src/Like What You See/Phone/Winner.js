import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import giphyRandom from 'giphy-random';
import { giphyKey } from '../../secrets';

const styles = {};

export default withStyles(styles)(
  class Winner extends Component {
    constructor() {
      super();
      this.state = {
        winner: {},
        gif: '',
      };
    }

    async componentDidMount() {
      let { data } = await giphyRandom(giphyKey, {
        tag: 'clapping',
        rating: 'pg',
      });
      this.setState({ gif: data.image_url });
      //Check if game over gets flagged on room, reroute to phone home if true
      //Check if restart is flagged on room, reroute to waiting room if true
      //If game is restarting, update player fields in db to base values
      //refnum null, score 0, isJudge false, image null
    }
    render() {
      return (
        <div>
          <h1>We have a winner!</h1>
          <div className="GifDiv">
            {gif ? (
              <img src={gif} />
            ) : (
              <img src="https://media.giphy.com/media/xUPGcMzwkOY01nj6hi/giphy.gif" />
            )}
          </div>
        </div>
      );
    }
  }
);
