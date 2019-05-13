import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  withStyles,
  Typography,
  Button,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Face from '@material-ui/icons/Face';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { db } from './index';

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
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
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
        .collection('games')
        .doc(`${game.name}`)
        .collection('rooms')
        .doc(`${roomNumber}`);
      let users = room.collection('users');
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
        .collection('games')
        .doc(`${currentGame.name}`)
        .collection('rooms')
        .doc(`${roomNumber}`);
      room
        .collection('users')
        .doc(`${firstJudge}`)
        .set(
          {
            isJudge: true,
          },
          { merge: true }
        );

      room.set(
        {
          judgeChange: true,
          judge: firstJudge,
        },
        { merge: true }
      );
      return this.props.history.push({
        pathname: `/${currentGame.name}/${roomNumber}/prompt`,
        state: { judge: firstJudge, roomNumber, players, game: currentGame },
      });
    };

    render() {
      const { currentGame, roomNumber, players } = this.state;
      const renderer = () => {
        if (currentGame.name) {
          return (
            <div className="App">
              <div>
                <header className="header">
                  <img src={require('./LastLogo.png')} alt="logo" />
                </header>
                <Grid
                  container
                  spacing={40}
                  alignItems="center"
                  justify="center"
                >
                  <Card
                    raised={true}
                    style={{
                      position: 'absolute',
                      top: '56%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <CardMedia
                      image={currentGame.image}
                      title={currentGame.name}
                    />
                    <CardContent>
                      <Typography variant="h6" align="center">
                        {currentGame.name}
                      </Typography>
                      <Typography variant="body1" align="center" gutterBottom>
                        {currentGame.description}
                      </Typography>
                      <Typography variant="caption" align="center">
                        Player: {currentGame.players}
                      </Typography>
                    </CardContent>
                    <Typography align="center">
                      <h2>Room Code: {roomNumber}</h2>
                    </Typography>
                    {players.map(player => {
                      return (
                        <div className={styles.root} key={player.name}>
                          <Grid container spacing={16}>
                            <Grid item xs={12} md={6}>
                              <div className={styles.demo}>
                                <List>
                                  <ListItem>
                                    <ListItemAvatar>
                                      <Face />
                                    </ListItemAvatar>
                                    <ListItemText primary={player.name} />
                                  </ListItem>
                                </List>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      );
                    })}
                    <Button
                      onClick={this.startGame}
                      // disabled={players.length > 2 ? false : true}
                    >
                      Start the Game!
                    </Button>
                  </Card>
                </Grid>
              </div>
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
