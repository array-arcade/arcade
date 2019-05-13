import React from 'react';
import './App.css';
import classNames from 'classnames';
import {
  Card,
  Grid,
  CardMedia,
  CardContent,
  withStyles,
  Typography,
  Button,
  CardActions,
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/firestore';

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
  class App extends React.Component {
    constructor() {
      super();
      this.state = {
        games: [],
      };
    }

    async componentDidMount() {
      let db = firebase.firestore();
      let dbGames = db.collection('games');
      await dbGames.get().then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({ games: [...this.state.games, doc.data()] });
        });
      });
    }

    createRoom = async game => {
      let db = firebase.firestore();
      let roomNumber = Math.floor(1000 + Math.random() * 9000);
      const selection = db.collection('games').doc(`${game.name}`);
      selection
        .collection('rooms')
        .doc(`${roomNumber}`)
        .set({
          roomNumber: `${roomNumber}`,
          timesUp: false,

          judgeChange: false,
          prompt: '',
          takenArtists: [],
        });
      //redirect to game home, passing selection and room number as properties
      return this.props.history.push({
        pathname: `/${game.name}/${roomNumber}/lobby`,
        state: { roomNumber, game },
      });
    };

    render() {
      const { games } = this.state;
      const { classes } = this.props;
      return (
        <div className="App">
          <header className="header">
            <img src={require('./LastLogo.png')} alt="logo" />
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
                          onClick={() => this.createRoom(game)}
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
