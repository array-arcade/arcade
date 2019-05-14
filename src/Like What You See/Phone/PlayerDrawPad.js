import React from "react";
import CanvasDraw from "react-canvas-draw";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Undo from "@material-ui/icons/Undo";
import Check from "@material-ui/icons/Check";
import { disableBodyScroll } from "body-scroll-lock";
import { db } from "../../index";

class DrawPad extends React.Component {
  targetElement = null;

  constructor() {
    super();
    this.state = {
      user: {},
      roomNum: null,
      game: {},
      prompt: false,
      artists: [],
      takenArtists: []
    };
  }

  async componentDidMount() {
    this.targetElement = document.querySelector("canvas");
    disableBodyScroll(this.targetElement);
    const { user, roomNum, game } = this.props.location.state;
    const dbGame = db.collection("games").doc("Like What You See?");
    const room = dbGame.collection("rooms").doc(`${roomNum}`);
    room
      .collection("users")
      .doc(`${user.name}`)
      .update({ image: null });
    const artists = await dbGame.get().then(game => game.data().artists);
    this.setState({ user, roomNum, game, artists });
    this.timerUnsub = room.onSnapshot(snapshot => {
      this.setState({ takenArtists: snapshot.data().takenArtists });
      if (snapshot.data().timesUp) {
        this.handleClick();
      }
      if (snapshot.data().prompt) {
        this.setState({ prompt: true });
      }
    });
  }

  handleClick = () => {
    const { user, roomNum, game, artists, takenArtists } = this.state;
    let numRef = this.randomArtist(artists, takenArtists);
    takenArtists.push(numRef);
    const dbRoom = db
      .collection("games")
      .doc(`${game.name}`)
      .collection("rooms")
      .doc(`${roomNum}`);
    let dbUser = dbRoom.collection("users").doc(`${user.name}`);
    dbRoom.update({
      takenArtists: takenArtists
    });
    dbUser.update({
      refNum: numRef,
      image: this.saveableCanvas.getSaveData()
    });
    return this.props.history.push({
      pathname: `/${roomNum}/waitingroom`,
      state: { roomNum, currentGame: game, user }
    });
  };

  randomArtist = (artists, takenArtists) => {
    let artistIdx = Math.floor(Math.random() * artists.length);
    let artistRef = artists[artistIdx];
    if (takenArtists.includes(artistRef)) {
      return this.randomArtist(artists, takenArtists);
    } else {
      return artistRef;
    }
  };

  componentWillUnmount() {
    this.timerUnsub();
  }

  render() {
    return (
      <div className="DrawingScreen">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Array Arcade
            </Typography>
          </Toolbar>
        </AppBar>
        <div id="canvas">
          <CanvasDraw
            ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
            hideGrid={true}
            brushRadius={3}
            lazyRadius={0}
            canvasHeight={350}
            brushColor="#000000"
            style={{
              boxShadow:
                "0 13px 27px -5px rgba(20, 20, 63, 0.1),    0 2px 3px -2px rgba(1, 200, 1, 0.3)"
            }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth={true}
          onClick={() => {
            this.saveableCanvas.clear();
          }}
        >
          <DeleteIcon />
          Clear
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth={true}
          onClick={() => {
            this.saveableCanvas.undo();
          }}
        >
          <Undo />
          Undo
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth={true}
          onClick={() => {
            this.handleClick();
          }}
          disabled={!this.state.prompt}
        >
          <Check />
          Submit
        </Button>
      </div>
    );
  }
}

export default DrawPad;
