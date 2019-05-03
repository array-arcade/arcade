import React from "react";
import "./App.css";
import classNames from "classnames";
import {
  Card,
  Grid,
  CardMedia,
  CardContent,
  withStyles,
  Typography
} from "@material-ui/core";

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
    marginTop: '30px',
    paddingTop: "50%",
    height: "100%"
  }
});

export default withStyles(styles)(
  class App extends React.Component {
    constructor() {
      super();
      this.state = {
        games: [
          {
            name: "Game",
            description: "This is a description",
            players: "1-4",
            image: "https://img.fireden.net/v/image/1448/84/1448846792467.jpg",
            id: 1
          },
          {
            name: "Game2",
            description: "This is a description",
            players: "2-6",
            image: "https://img.fireden.net/v/image/1448/84/1448846792467.jpg",
            id: 2
          }
        ]
      };
    }

    componentDidMount() {}

    render() {
      const { games } = this.state;
      const { classes } = this.props;

      return (
        <div className="App">
          <header className="header">
            <img src={require("./logo.png")} alt="logo" />
          </header>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40} alignItems='center' justify='center'>
              {games.map(game => {
                return (
                  <Grid item key={game.id} sm={6} md={4} lg={3}>
                    <Card className={classes.card} raised={true}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={game.image}
                        title={game.name}
                      />
                      <CardContent className="game-description">
                        <Typography variant="h6">{game.name}</Typography>
                        <Typography variant="body1" gutterBottom>
                          {game.description}
                        </Typography>
                        <Typography variant="caption">
                          {game.players}
                        </Typography>
                      </CardContent>
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
