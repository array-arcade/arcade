import React, { Component } from "react";
import {
  Paper,
  withStyles,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TouchApp } from "@material-ui/icons";
import {db} from "../../index"

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    minHeight: "100vh",
    margin: "10px"
  },
  wordHolder: {
    display: "flex",
    justifyContent: "space-between"
  }
});

//This will be rendered through the waiting room
//and will redirect to JudgeVote
export default withStyles(styles)(
  class WordPick extends Component {
    constructor() {
      super();
      this.state = {
        words: [
          "Zipper",
          "Restaurant",
          "Cave",
          "Zebra",
          "Pokemon",
          "Meme",
          "Panda",
          "Bagpipe",
          "Pastry",
          "Cacti",
          "Cowboy",
          "Ninja",
          "Pirate",
          "Mailbox",
          "Gingerbread Man",
          "Cherry Bomb",
          "Cat",
          "Dog",
          "Dogs Playing Poker",
          "Snowman",
          "M&Ms",
          "Newborn Baby",
          "Prison Riot",
          "Angry Old Man",
          "Shame"
        ],
        displayWords: [],
        open: false,
        roomNum: 0,
        game: {},
        user: {}
      };
    }

    componentDidMount() {
      let { roomNum, game, user } = this.props.location.state
      this.setState({ roomNum, game, user })
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
      const { roomNum, game, user } = this.state
      const roomRef = db.collection("games").doc(`${game.name}`).collection("rooms").doc(`${roomNum}`)
      roomRef.set({
        prompt: word
      }, {merge: true})
      return this.props.history.push({
        pathname: `/vote`,
        state: { roomNum, game, user }

      });
    };

    render() {
      const { displayWords, open } = this.state;
      const { classes } = this.props;

      return (
        <div>
          <Paper elevation={4} className={classes.root}>
            {displayWords.map(word => {
              return (
                <Card key={word}>
                  <Grid container spacing={24} className={classes.wordHolder}>
                    <Grid item>
                      <CardContent>
                        <Typography variant="h4" >
                          {word}
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid item>
                      <CardActions>
                        <IconButton onClick={() => this.setState({ open: true })}>
                          <TouchApp />
                        </IconButton>
                        <Dialog open={open} onClose={() => this.setState({ open: false})}>
                          <DialogContent>
                            <DialogContentText>
                              Is this the prompt you want to choose? {word}
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => this.selectWord(word)}>
                              YES!
                            </Button>
                            <Button onClick={() => this.setState({ open: false })}>
                              NO!
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </CardActions>
                    </Grid>
                  </Grid>
                </Card>
              );
            })}
          </Paper>
        </div>
      );
    }
  }
);
