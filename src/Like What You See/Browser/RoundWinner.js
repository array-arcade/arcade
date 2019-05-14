import React, { Component } from "react";
import {
  withStyles,
  Card,
  CardContent,
  Typography,
  CardMedia
} from "@material-ui/core";
import FooterScore from "../Browser/ScoreDisplay";
import CanvasDraw from "react-canvas-draw";
import { db } from "../../index";

const styles = {
  card: {
    height: "650px",
    width: "650px",
    display: "flex",
    flexDirection: "column",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
};

export default withStyles(styles)(
  class Winner extends Component {
    constructor() {
      super();
      this.state = {
        winner: {}
      };
    }

    async componentDidMount() {
      const { game, roomNumber, players, winner } = this.props.location.state;
      const dbRoom = db
        .collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNumber}`);
      const dbWinner = dbRoom.collection("users").doc(`${winner}`);
      await dbWinner.get().then(snapshot => {
        this.setState({ winner: snapshot.data() });
      });
      this.unsub = dbRoom.onSnapshot(snapshot => {
        if (snapshot.data().prompt) {
          return this.props.history.push({
            pathname: `/${game.name}/${roomNumber}/prompt`,
            state: { players, game, roomNumber, judge: snapshot.data().judge }
          });
        }
      });
      this.timeout(players, game, roomNumber, winner);
    }

    timeout = (players, game, roomNumber, winner) => {
      const history = this.props.history
      setTimeout(function() {
        return history.push({
          pathname: `/${game.name}/${roomNumber}/prompt`,
          state: { players, game, roomNumber, judge: winner }
        });
      }, 5000);
    };

    componentWillUnmount() {
      clearTimeout(this.timeout);
      this.unsub();
    }

    render() {
      const { winner } = this.state;
      const { classes } = this.props;

      return (
        <div className="App">
          <Card className={classes.card} raised={true}>
            <CardContent>
              <Typography variant="h3">
                {winner.name} has won the round, bask in their splendor.
              </Typography>
            </CardContent>
            <CardMedia>
              <CanvasDraw
                canvasWidth={600}
                canvasHeight={550}
                disabled={true}
                hideGrid={true}
                saveData={winner.image}
                immediateLoading={true}
              />
            </CardMedia>
          </Card>
        </div>
      );
    }
  }
);
