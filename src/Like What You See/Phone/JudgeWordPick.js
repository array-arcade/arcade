import React, { Component } from 'react';
import { Paper, withStyles, Typography, Button } from '@material-ui/core';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

//This will be rendered through the waiting room
//and will redirect to JudgeVote
export default withStyles(styles)(
  class WordPick extends Component {
    constructor() {
      super();
      this.state = {
        words: [
          'Zipper',
          'Restaurant',
          'Cave',
          'Zebra',
          'Pokemon',
          'Meme',
          'Panda',
          'Bagpipe',
          'Pastry',
          'Cacti',
          'Cowboy',
          'Ninja',
          'Pirate',
          'Mailbox',
          'Gingerbread Man',
          'Cherry Bomb',
          'Cat',
          'Dog',
          'Dogs Playing Poker',
          'Snowman',
          'M&Ms',
          'Newborn Baby',
          'Prison Riot',
          'Angry Old Man',
          'Shame',
        ],
        displayWords: [],
      };
    }

    componentDidMount() {
      this.wordScramble();
    }

    wordScramble = () => {
      let displayWords = [];
      while (displayWords.length < 7) {
        let randomIdx = Math.floor(Math.random() * this.state.words.length);
        if (!displayWords.includes(this.state.words[randomIdx])) {
          displayWords.push(this.state.words[randomIdx]);
        }
      }
      this.setState({ displayWords });
    };

    selectWord = event => {
      console.log('I have been clicked!', event);
    };

    render() {
      const { displayWords } = this.state;
      const { classes } = this.props;

      return (
        <div className="Mobile">
          <Paper elevation={4} className={classes.root}>
            {displayWords.map(word => {
              return (
                <Button>
                  <Typography variant="h3" onClick={this.selectWord} key={word}>
                    {word}
                  </Typography>
                </Button>
              );
            })}
          </Paper>
        </div>
      );
    }
  }
);
