import React from 'react';
import CanvasDraw from 'react-canvas-draw';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Undo from '@material-ui/icons/Undo';
import Check from '@material-ui/icons/Check';
import { disableBodyScroll } from 'body-scroll-lock';

class DrawPad extends React.Component {
  targetElement = null;

  constructor() {
    super();
    this.state = {
      user: {},
      roomNum: null,
      game: {},
    };
  }

  componentDidMount() {
    this.targetElement = document.querySelector('canvas');
    disableBodyScroll(this.targetElement);
    const { user, roomNum, game } = this.props.location.state;
    this.setState({ user, roomNum, game });
  }
  handleClick = () => {
    const { user, roomNum, game } = this.state;
    let db = firebase.firestore();
    let dbGames = db
      .collection('games')
      .doc(`${game.name}`)
      .collection('rooms')
      .doc(`${roomNum}`)
      .collection('users')
      .doc(`${user.name}`);
    dbGames.set(
      {
        image: this.saveableCanvas.getSaveData(),
      },
      { merge: true }
    );
  };
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
                '0 13px 27px -5px rgba(20, 20, 63, 0.1),    0 2px 3px -2px rgba(1, 200, 1, 0.3)',
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
        >
          <Check />
          Submit
        </Button>
      </div>
    );
  }
}

export default DrawPad;
