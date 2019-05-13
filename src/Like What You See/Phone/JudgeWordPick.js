import React, { Component } from 'react';
import {
  Paper,
  withStyles,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import { TouchApp } from '@material-ui/icons';
import { db } from '../../index';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    minHeight: '100vh',
    margin: '10px',
  },
  wordHolder: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
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
          'Newborn Baby',
          'Prison Riot',
          'Angry Old Man',
          'Shame',
        ],
        displayWords: [],
        open: false,
        roomNum: 0,
        game: {},
        user: {},
        selected: '',
      };
    }

    componentDidMount() {
      let { roomNum, game, user } = this.props.location.state;
      this.setState({ roomNum, game, user });
      db.collection('games')
        .doc(`${game.name}`)
        .collection('rooms')
        .doc(`${roomNum}`)
        .update({ judgeChange: false });
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

    selectWord = word => {
      const { roomNum, game, user } = this.state;
      const roomRef = db
        .collection('games')
        .doc(`${game.name}`)
        .collection('rooms')
        .doc(`${roomNum}`);
      roomRef.set(
        {
          prompt: word,
        },
        { merge: true }
      );
      return this.props.history.push({
        pathname: `/vote`,
        state: { roomNum, game, user },
      });
    };

    render() {
      const { displayWords, open, selected } = this.state;
      const { classes } = this.props;

      return (
        <div>
          <Paper elevation={4} className={classes.root}>
            {displayWords.map(word => {
              return (
                <Card key={word}>
                  {/* <Grid container spacing={24} className={classes.wordHolder}> */}
                  {/* <Grid item> */}
                  <CardContent>
                    <Button
                      fullWidth={true}
                      color="primary"
                      onClick={() =>
                        this.setState({ open: true, selected: word })
                      }
                    >
                      <Typography variant="h4">{word}</Typography>
                      <TouchApp />
                    </Button>
                  </CardContent>
                  <CardActions>
                    <Dialog
                      open={open}
                      onClose={() =>
                        this.setState({ open: false, selected: '' })
                      }
                    >
                      <DialogContent>
                        <DialogContentText>
                          Is this the prompt you want to choose? {selected}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() =>
                            this.setState({ open: false, selected: '' })
                          }
                        >
                          NO!
                        </Button>
                        <Button onClick={() => this.selectWord(selected)}>
                          YES!
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </CardActions>
                </Card>
              );
            })}
          </Paper>
        </div>
      );
    }
  }
);
