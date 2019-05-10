import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  withStyles,
  Typography,
  Button
} from "@material-ui/core";
import { db } from "./index";

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
      const room = db
        .collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNumber}`);
      let users = room.collection("users");
      this.unsubscribe = users.onSnapshot(snapshot => {
        let players = snapshot.docs.map(doc => doc.data());
        this.setState({ players: players });
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    startGame = () => {
      const firstJudge = this.state.players[0].name;
      const { currentGame, roomNumber, players } = this.state;
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

      room.set(
        {
          judgeChange: true,
          judge: firstJudge
        },
        { merge: true }
      );
      return this.props.history.push({
        pathname: `/${currentGame.name}/${roomNumber}/prompt`,
        state: { judge: firstJudge, roomNumber, players, game: currentGame }
      });
    };

    render() {
      const { currentGame, roomNumber, players } = this.state;
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
                //disabled={players.length > 2 ? false : true}
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
