//This will display the pictures the judge can choose from
//Rendered by PromptScreen after timer is up or pictures are all submitted
//Will redirect to either the prompt or victory screen

import React, { Component } from "react";
import classNames from "classnames";
import {
  Card,
  Grid,
  CardContent,
  Typography,
  withStyles
} from "@material-ui/core";
import CanvasDraw from "react-canvas-draw";
import FooterScore from "../Browser/ScoreDisplay";
import { db } from "../../index";

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
    height: "425px",
    width: "450px",
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
  class PictureDisplays extends Component {
    constructor() {
      super();
      this.state = {
        user: {},
        roomNumber: null,
        game: {},
        players: [],
        judge: {}
      };
    }

    async componentDidMount() {
      const { game, roomNumber, players, prompt } = this.props.location.state;
      this.setState({ game, roomNumber });
      const dbRoom = db
        .collection("games")
        .doc(`${game.name}`)
        .collection("rooms")
        .doc(`${roomNumber}`);
      dbRoom.update({ prompt: "", TimesUp: false, submissions: false });
      let dbUsers = dbRoom.collection("users");
      this.usersUnsub = dbUsers.onSnapshot(snapshot => {
        let dbPlayers = snapshot.docs.map(doc => doc.data());
        this.setState({ players: dbPlayers.filter(player => !player.isJudge) });
      });
      this.roomUnsub = dbRoom.onSnapshot(snapshot => {
        if (snapshot.data().judgeChange) {
          return this.props.history.push({
            pathname: `/${game.name}/${roomNumber}/winner`,
            state: { winner: snapshot.data().judge, players, roomNumber, game }
          });
        } else if (snapshot.data().winner) {
          return this.props.history.push({
            pathname: `/${game.name}/${roomNumber}/victory`,
            state: { winner: snapshot.data().judge, roomNumber, game, prompt }
          });
        }
      });
    }

    componentWillUnmount() {
      this.roomUnsub();
      this.usersUnsub();
    }

    render() {
      let { players, roomNumber } = this.state;
      let { classes } = this.props;

      return (
        <div className="App">
          <div>
            <h2>Wow... What artists! Judge choose wisely!</h2>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40} alignContent="space-around">
              {players.map(player => {
                return (
                  <Grid item key={player.name} sm={6} md={4} lg={3}>
                    <Card className={classes.card} raised={true}>
                      <CanvasDraw
                        canvasWidth={400}
                        canvasHeight={350}
                        disabled={true}
                        hideGrid={true}
                        saveData={player.image}
                      />
                      <CardContent>
                        <Typography variant="h4">{player.refNum}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </div>
          {this.state.roomNumber ? (
            <FooterScore players={players} roomNumber={roomNumber} />
          ) : (
            <h1>No state</h1>
          )}{" "}
        </div>
      );
    }
  }
);
