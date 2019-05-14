//This will display after a player has reached the score to win
//Can redirect either to the Lobby or the browser home depending
//on if the game is restarted or the room is destroyed

import React, { Component } from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  withStyles,
  CardActions
} from "@material-ui/core";
import { db } from "../../index";
import CanvasDraw from "react-canvas-draw";

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

class VictoryScreen extends Component {
  constructor() {
    super();
    this.state = {
      winner: {},
      roomNum: 0,
      game: {},
      prompt: ""
    };
  }

  async componentDidMount () {
    let { winner, roomNumber, game, prompt } = this.props.location.state;
    const dbWinner = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
      .doc(`${roomNumber}`)
      .collection("users")
      .doc(`${winner}`);
    await dbWinner.get().then(snapshot => {
      winner = snapshot.data();
    });
    this.setState({ winner, roomNum: roomNumber, game, prompt });
  }

  restart = async () => {
    const { roomNum, game } = this.state;
    const dbRoom = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
      .doc(`${roomNum}`);
    dbRoom.set({
      judgeChange: false,
      roomNumber: `${roomNum}`,
      timesUp: false,
      prompt: "",
      takenArtists: [],
      restart: true
    });
    return this.props.history.push({
      pathname: `/${game.name}/${roomNum}/lobby`,
      state: { roomNumber: roomNum, game }
    });
  };

  exitGame = () => {
    const { roomNum } = this.state;
    let dbRoom = db
      .collection("games")
      .doc("Like What You See?")
      .collection("rooms")
      .doc(`${roomNum}`);
    dbRoom.update({ gameOver: true });
    dbRoom
      .collection("users")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
    dbRoom.delete();
    return this.props.history.push({ pathname: `/browse` });
  };

  render() {
    const { winner } = this.state;
    const { classes } = this.props;

    return (
      <div className="App">
        <Card className={classes.card} raised={true}>
          <CardContent>
            <Typography>
              {winner.name} has won the game! Gaze upon their latest
              masterpiece!
            </Typography>
          </CardContent>
          <CardMedia>
            <CanvasDraw
              canvasWidth={600}
              canvasHeight={550}
              disabled={true}
              hideGrid={true}
              saveData={winner.image}
            />
          </CardMedia>
          <CardActions>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={this.restart}
            >
              Play again?
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => this.exitGame()}
            >
              Leave Game
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(VictoryScreen);
