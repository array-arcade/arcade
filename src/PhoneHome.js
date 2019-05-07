import React from 'react';
import TextField from '@material-ui/core/TextField';
import Face from '@material-ui/icons/Face';
import DialPad from '@material-ui/icons/Dialpad';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import SnackBar from './SnackBar';

import {
  withStyles,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { disableBodyScroll } from 'body-scroll-lock';

const styles = theme => ({
  cardItem: {
    display: 'flex',
    justifyContent: 'center',
    alignitems: 'center',
    padding: '7px',
  },
  selections: {
    minWidth: 120,
    margin: theme.spacing.unit,
    dislay: 'flex',
    justifyContent: 'center',
    alignitems: 'center',
  },
});

export default withStyles(styles)(
  class PhoneHome extends React.Component {
    constructor() {
      super();
      this.state = {
        user: '',
        roomNum: '',
        selectedGame: 'none',
        games: [],
        error: false,
      };
    }
    targetElement = null;

    async componentDidMount() {
      const db = firebase.firestore();
      const dbGames = db.collection('games');
      await dbGames.get().then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({ games: [...this.state.games, doc.data()] });
        });
      });
      this.targetElement = document.querySelector('Mobile');
      disableBodyScroll(this.targetElement);
    }

    handleChange = evt => {
      this.setState({
        [evt.target.name]: evt.target.value,
      });
    };

    addUser = () => {
      const db = firebase.firestore();
      const { roomNum, user, selectedGame } = this.state;
      if (selectedGame === 'none' || user === '') {
        this.setState({ error: true });
        return;
      }
      const game = db.collection('games').doc(`${selectedGame}`);
      let size, max;
      game.get().then(snap => {
        max = snap.max;
      });
      const roomRef = game.collection('rooms').doc(`${roomNum}`);
      roomRef
        .get()
        .then(room => {
          if (room.exists) {
            //here's where you check for max players reached
            let room = game.collection('rooms').doc(`${roomNum}`);
            room.get().then(snap => {
              size = snap.size; // will return the room size
            });
            if (size <= max) {
              room
                .collection('users')
                .doc(`${user}`)
                .set({
                  name: `${user}`,
                });
            } else {
              //render code indicating room is full
              return <SnackBar message="Room is full!" />;
            }
            room
              .collection('users')
              .doc(`${user}`)
              .set({
                name: `${user}`,
              });
          } else {
            this.setState({ error: true });
          }
        })
        .catch(err => console.log('Something went wrong!', err));
    };

    render() {
      const { games } = this.state;
      const { classes } = this.props;

      return (
        <div className="Mobile">
          <header className="header">
            <img src={require('./logo.png')} alt="logo" />
          </header>
          <div
            style={{
              position: 'absolute',
              top: '60%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
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
                  inputProps={{ name: 'selectedGame' }}
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
                      An error has occured. Make sure you have a name and a
                      valid room number for the game you are trying to play.
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
