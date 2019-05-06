import React from "react";
import "./App.css";
import classNames from "classnames";
import {
  Card,
  Grid,
  CardMedia,
  CardContent,
  withStyles,
  Typography,
  Button,
  CardActions
} from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/firestore";

import { Redirect } from "react-router-dom";

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
  class App extends React.Component {
    constructor() {
      super();
      this.state = {
        games: []
      };
    }
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
*/
    async componentDidMount() {
      let db = firebase.firestore();
      let dbGames = db.collection("games");
      await dbGames.get().then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({ games: [...this.state.games, doc.data()] });
        });
      });
    }

    createRoom = async game => {
      let db = firebase.firestore();
      let roomNumber = Math.floor(1000 + Math.random() * 9000);
      const selection = db.collection("games").doc(`${game}`);
      selection
        .collection("rooms")
        .doc(`${roomNumber}`)
        .set({
          roomNumber: `${roomNumber}`
        });

      //redirect to game home, passing selection and room number as properties
      {
        <Redirect
          to={{
            pathname: "/game",
            state: { roomNumber, game }
          }}
        />;
      }
      //from game home, see how many players have joined the room
      //redirect to game screen after user has started the game
    };

    //     You can pass data with Redirect like this:
    // <Redirect to={{
    //             pathname: '/order',
    //             state: { id: '123' }
    //         }}
    // />
    // and this is how you can access it:
    // this.props.location.state.id

    render() {
      const { games } = this.state;
      const { classes } = this.props;

      return (
        <div className="App">
          <header className="header">
            <img src={require("./logo.png")} alt="logo" />
          </header>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40} alignItems="center" justify="center">
              {games.map(game => {
                return (
                  <Grid item key={game.name} sm={6} md={4} lg={3}>
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
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </div>
      );
    }
  }
);
