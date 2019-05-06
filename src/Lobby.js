import React from "react";
import classNames from "classnames";

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
import "firebase/firestore";

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
      this.state = {};
    }

    async componentDidMount() {
      let db = firebase.firestore();
      let game = db.collection("games");
      await game
        .where("name", "==", this.props.location.state.game)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.setState({
              game: doc.data(),
              room: this.props.location.state.roomNumber
            });
          });
        });
    }

    render() {
      //from game home, see how many players have joined the room & render start button when minimum has been reached
      //redirect to game screen after user has started the game

      const { game, room } = this.state;
      const { classes } = this.props;

      console.log(game);

      return (
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
            <Typography variant="caption">Player: {game.players}</Typography>
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
      );
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
