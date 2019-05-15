import React from "react";
import TextField from "@material-ui/core/TextField";
import Face from "@material-ui/icons/Face";
import DialPad from "@material-ui/icons/Dialpad";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

import {
  withStyles,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/firestore";
import { disableBodyScroll } from "body-scroll-lock";

const styles = theme => ({
  cardItem: {
    display: "flex",
    justifyContent: "center",
    alignitems: "center",
    padding: "7px"
  },
  selections: {
    minWidth: 120,
    margin: theme.spacing.unit,
    dislay: "flex",
    justifyContent: "center",
    alignitems: "center"
  }
});

export default withStyles(styles)(
  class PhoneHome extends React.Component {
    constructor() {
      super();
      this.state = {
        user: "",
        roomNum: "",
        selectedGame: "none",
        games: [],
        error: false,
        message: "",
        names: []
      };
    }
    targetElement = null;

    async componentDidMount() {
      const db = firebase.firestore();
      const dbGames = db.collection("games");
      await dbGames.get().then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({ games: [...this.state.games, doc.data()] });
        });
      });
      this.targetElement = document.querySelector("Mobile");
      disableBodyScroll(this.targetElement);
    }

    handleChange = evt => {
      this.setState({
        [evt.target.name]: evt.target.value
      });
    };

    addUser = async () => {
      const db = firebase.firestore(); //create ref to firestore
      let { roomNum, user, selectedGame } = this.state; //put state in local var
      if (selectedGame === "none" || user === "" || roomNum === "") {
        //validate fields
        this.setState({
          error: true,
          message:
            "An error has occured. Make sure you have a name and a valid room number for the game you are trying to play."
        });
        return;
      }
      const game = db.collection("games").doc(`${selectedGame}`); //get game doc for selected game
      let size;
      let max; //vars to check for full room
      let currentGame = {};
      game.get().then(snap => {
        currentGame = snap.data();
        max = currentGame.max; //gets a snapshot of game doc and sets max players to max
      });
      const roomRef = game.collection("rooms").doc(`${roomNum}`); //gets ref to room collection from game
      await roomRef.collection("users").get().then(snapshot => {
        let names = snapshot.docs.map(doc => doc.data().name)
        this.setState({ names })
      });
      let { names } = this.state
      if (names.includes(user)) {
        this.setState({
          error: true,
          message:
            "That name is taken, try another!"
        });
        return;
      }
      roomRef
        .get()
        .then(async room => {
          if (room.exists) {
            //here's where you check for max players reached
            await roomRef
              .collection("users")
              .get()
              .then(async snapshot => {
                size = await snapshot.docs.length; // will return the room size
              });
            if (size < max) {
              //add the user (and redirect)
              roomRef
                .collection("users")
                .doc(`${user}`)
                .set({
                  name: `${user}`,
                  score: 0
                });

              return this.props.history.push({
                pathname: `/${roomNum}/waitingroom`,
                state: { roomNum, currentGame, user: { name: user, score: 0 } }
              });
            } else {
              //render code indicating room is full
              this.setState({
                error: true,
                message:
                  "The selected room is full currently and you will not be able to join."
              });
            }
          } else {
            this.setState({
              error: true,
              message:
                "An error has occured. Make sure you have a name and a valid room number for the game you are trying to play."
            });
          }
        })
        .catch(err => console.log("Something went wrong!", err));
    };

    render() {
      const { games } = this.state;
      const { classes } = this.props;

      return (
        <div className="Mobile">
          <header className="header">
            <img src={require("./phonelogo.png")} alt="logo" />
          </header>
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <Card alignitems="center" justify="center">
              <CardContent>
                <div className={classes.cardItem}>
                  <Face />
                </div>
                <div className={classes.cardItem}>
                  <TextField
                    id="input-with-icon-grid"
                    label="Name"
                    name="user"
                    value={this.state.user}
                    onChange={this.handleChange}
                  />
                </div>
                <div className={classes.cardItem}>
                  <DialPad />
                </div>
                <div className={classes.cardItem}>
                  <TextField
                    id="input-with-icon-grid"
                    label="Room Code"
                    name="roomNum"
                    value={this.state.roomNum}
                    onChange={this.handleChange}
                  />
                </div>
                <Select
                  onChange={this.handleChange}
                  value={this.state.selectedGame}
                  inputProps={{ name: "selectedGame" }}
                  className={classes.selections}
                >
                  <InputLabel>Choose Game</InputLabel>
                  <MenuItem value="none">
                    <em>Choose a game</em>
                  </MenuItem>
                  {games.map(game => (
                    <MenuItem value={game.name} key={game.name}>
                      {game.name}
                    </MenuItem>
                  ))}
                </Select>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  color="primary"
                  fullWidth={true}
                  onClick={this.addUser}
                >
                  Submit
                </Button>
                <Dialog
                  open={this.state.error}
                  onClose={() => this.setState({ error: false })}
                >
                  <DialogContent>
                    <DialogContentText>
                      <DialogContentText>
                        {this.state.message}
                      </DialogContentText>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.setState({ error: false })}>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardActions>
            </Card>
          </div>
        </div>
      );
    }
  }
);
