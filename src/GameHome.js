import React from "react";
import {
  Card,
  //Grid,
  CardMedia,
  CardContent,
  withStyles,
  Typography,
  Button,
  CardActions
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
  class GameHome extends React.Component {
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
      });
    }

    render() {
      //from game home, see how many players have joined the room
      //redirect to game screen after user has started the game

      const { currentGame, roomNumber, players } = this.state;
      console.log(`Game:`, currentGame, roomNumber, players);

      const renderer = () => {
        if (currentGame.name) {
          return (
            <div>
              <h1>{currentGame.name}</h1>
              <h2>{roomNumber}</h2>
              {players.map(player => {
                return <p>{player.name}</p>;
              })}
            </div>
          );
        }
      };

      return <div>{renderer()}</div>;
    }
  }
);

/*
games: {
  Like What You See?: {
    description: ...
    image: ...
    name: ...
    players: ...
    rooms: {
      3444: {
        roomNumber: 3444
      }
      8810: {
        roomNumber: 8810
      }
    }
  }
}

<Card className={classes.card} raised={true}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={game.image}
                        title={game.name}
                      />
                      <CardContent>
                        <Typography variant="h6">{game.name}</Typography>
                        <Typography variant="body1" gutterBottom>
                          {game.description}
                        </Typography>
                        <Typography variant="caption">
                          Player: {game.players}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="medium"
                          color="primary"
                          onClick={() => this.createRoom(game.name)}
                        >
                          Create Room
                        </Button>
                      </CardActions>
                    </Card>
*/
