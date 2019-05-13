import React, { Component } from "react";
import { withStyles, Card, CardContent, Typography } from "@material-ui/core";
import FooterScore from "../Browser/ScoreDisplay";
import CanvasDraw from "react-canvas-draw";
import { db } from "../../index";

const styles = {
  card: {
    height: "600px",
    width: "650px",
    display: "flex",
    flexDirection: "column"
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

    componentDidMount() {
      const { game, roomNumber, players, winner } = this.props.location.state;
      const dbRoom = db
        .collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNumber}`);
      const dbWinner = dbRoom.collection("users").doc(`${winner}`);
      dbWinner.get().then(snapshot => {
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
      this.timeout = setTimeout(function() {
        return this.props.history.push({
          pathname: `/${game.name}/${roomNumber}/prompt`,
          state: { players, game, roomNumber, judge: winner }
        }); 
      }, 10000)
    }

    componentWillUnmount() {
      clearTimeout(this.timeout)
      this.unsub()
    }

    render() {
      const { winner } = this.state;
      const { classes } = this.props;

      return (
        <div className="App">
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h3">
                {winner.name} has won the round, bask in their splendor.
              </Typography>
            </CardContent>
            <CanvasDraw
              canvasWidth={600}
              canvasHeight={550}
              disabled={true}
              hideGrid={true}
              saveData={winner.image}
            />
          </Card>
        </div>
      );
    }
  }
);
