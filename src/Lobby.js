import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  withStyles,
  Typography
} from "@material-ui/core";
import firebase from "firebase/app";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    marginTop: "30px",
    paddingTop: "50%",
    height: "100%"
  }
});

export default withStyles(styles)(
  class Lobby extends React.Component {
    constructor() {
      super();
      this.state = {
        currentGame: {},
        roomNumber: 0,
        players: []
      };
    }

    async componentDidMount() {
      const { game, roomNumber } = this.props.location.state;
      this.setState({ currentGame: game, roomNumber });
      let db = firebase.firestore();
      let users = db
        .collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNumber}`)
        .collection("users");
      users.onSnapshot(snapshot => {
        let players = snapshot.docs.map(doc => doc.data());
        this.setState({ players: players });
        if (this.state.players.length >= this.state.currentGame.min) {
          console.log("render button visible here");
        }
      });
    }

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
