//This will be rendered through JudgeWordPick and
//will redirect to the WaitingRoom
import React, { Component } from "react";
import { db } from "../../index";
import {
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  withStyles
} from "@material-ui/core";
import classNames from "classnames";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 5}px 0`
  }
});

export default withStyles(styles)(
  class JudgeVote extends Component {
    constructor() {
      super();
      this.state = {
        roomNum: 0,
        game: {},
        user: {},
        players: [],
        open: false,
        selected: ""
      };
    }

    componentDidMount() {
      const { roomNum, game, user } = this.props.location.state;
      this.setState({ roomNum, game, user });
      db.collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNum}`)
        .update({ previousJudge: user.name });
      let currentPlayers;
      const users = db
        .collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNum}`)
        .collection("users");
      this.unsubscribe = users.onSnapshot(snap => {
        currentPlayers = snap.docs.map(doc => doc.data());
        currentPlayers = this.shuffle(
          currentPlayers.filter(player => !player.isJudge)
        );
        this.setState({ players: currentPlayers });
      });
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    shuffle = array => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
      }
      return array;
    };

    selectPic = async userRef => {
      const { roomNum, game, user } = this.state;
      let newScore;
      let newJudge;
      const room = db
        .collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNum}`);
      const users = db
        .collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNum}`)
        .collection("users");
      let winner = users.doc(`${userRef.name}`);
      let judge = users.doc(`${user.name}`);
      judge.update({ isJudge: false });
      await winner.get().then(async snapshot => {
        newScore = snapshot.data().score + 1;
        newJudge = snapshot.data().name;
        await winner.update({ score: newScore, isJudge: true });
        if (snapshot.data().score >= 1) {
          await room.update({ winner: snapshot.data() });
          return this.props.history.push({
            pathname: `/winner`,
            state: { winner: snapshot.data() }
          });
        }
      });
      room.update({ judge: newJudge, judgeChange: true });
      return this.props.history.push({
        pathname: `/${roomNum}/waitingroom`,
        state: { roomNum, currentGame: game, user }
      });
    };

    render() {
      const imageCheck = player => {
        if (player.refNum) {
          return (
            <Grid item key={player.name} sm={6} md={4} lg={3}>
              <Button
                //add container and color. full length. margin inbetween.
                onClick={() => this.setState({ open: true, selected: player })}
              >
                {player.refNum}
              </Button>
              <Dialog
                open={open}
                onClose={() => this.setState({ open: false, selected: "" })}
              >
                <DialogContent>
                  <DialogContentText>
                    Is this the picture you want to choose? The artist of this
                    picture will be next rounds judge.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => this.selectPic(selected)}>YES!</Button>
                  <Button
                    onClick={() => this.setState({ open: false, selected: "" })}
                  >
                    NO!
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          );
        } else {
          return null;
        }
      };

      const { classes } = this.props;
      const { players, open, selected } = this.state;
      return (
        <div className="Mobile">
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40}>
              {players.map(player => {
                return imageCheck(player);
              })}
            </Grid>
          </div>
        </div>
      );
    }
  }
);
