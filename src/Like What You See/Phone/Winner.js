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
