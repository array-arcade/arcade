import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  withStyles,
  Typography,
  Button
} from "@material-ui/core";
import firebase from "firebase/app";
import { db } from "./index";

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    marginTop: '30px',
    paddingTop: '50%',
    height: '100%',
  },
});

export default withStyles(styles)(
  class Lobby extends React.Component {
    constructor() {
      super();
      this.state = {
        currentGame: {},
        roomNumber: 0,
        players: [],
      };
    }

    async componentDidMount() {
      const { game, roomNumber } = this.props.location.state;
      this.setState({ currentGame: game, roomNumber });
      const room = db
        .collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNumber}`);
      let users = room.collection("users");
      this.unsubscribe = users.onSnapshot(snapshot => {
        let players = snapshot.docs.map(doc => doc.data());
        this.setState({ players: players });
        if (this.state.players.length >= this.state.currentGame.min) {
          console.log('render button visible here');
        }
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    startGame = () => {
      const firstJudge = this.state.players[0].name;
      const { currentGame, roomNumber } = this.state;
      const room = db
        .collection("games")
        .doc(`${currentGame.name}`)
        .collection("rooms")
        .doc(`${roomNumber}`);
      room
        .collection("users")
        .doc(`${firstJudge}`)
        .set(
          {
            isJudge: true
          },
          { merge: true }
        );
        room.set({
          judge: firstJudge
        }, { merge: true })
    };

    render() {
      const { currentGame, roomNumber, players } = this.state;
      console.log(currentGame);
      const renderer = () => {
        if (currentGame.name) {
          return (
            <div>
              <Card raised={true}>
                <CardMedia image={currentGame.image} title={currentGame.name} />
                <CardContent>
                  <Typography variant="h6">{currentGame.name}</Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentGame.description}
                  </Typography>
                  <Typography variant="caption">
                    Player: {currentGame.players}
                  </Typography>
                </CardContent>
              </Card>
              <h1>{currentGame.name}</h1>
              <h2>{roomNumber}</h2>
              {players.map(player => {
                return <p>{player.name}</p>;
              })}
              <Button
                onClick={this.startGame}
                disabled={players.length > 2 ? false : true}
              >
                Start the Game!
              </Button>
            </div>
          );
        } else {
          return <h1>Please Hold.</h1>;
        }
      };

      return <div>{renderer()}</div>;
    }
  }
);
