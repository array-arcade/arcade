//This will display the pictures the judge can choose from
//Rendered by PromptScreen after timer is up or pictures are all submitted
//Will redirect to either the prompt or victory screen
import React, { Component } from 'react';
import classNames from 'classnames';
import { Card, Grid } from '@material-ui/core';
import CanvasDraw from 'react-canvas-draw';
import firebase from 'firebase/app';
import withStyles from '@material-ui/core/styles';
import FooterScore from '../Browser/ScoreDisplay';

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

class PictureDisplays extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      roomNum: null,
      game: {},
      images: [],
      judge: {},
    };
  }
  async componentDidMount() {
    let db = firebase.firestore();
    let dbPhotos = db
      .collection('games')
      .doc('Like What You See?')
      .collection('rooms')
      .doc('7979')
      .collection('users');
    await dbPhotos.get().then(snapshot => {
      return snapshot.ForEach(img => {
        this.setState({ images: [...this.state.images, img.data()] });
      });
    });
  }

  render() {
    let { images } = this.state;
    let { classes } = this.props;

    return (
      <div>
        <div>
          <header>judge name choose wisely is what should be rendered!</header>
        </div>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Grid container spacing={40} alignItems="center" justify="center">
            {images.map(img => {
              return (
                <Grid item key={img.name} sm={6} md={4} lg={3}>
                  <Card className={classes.card} raised={true}>
                    <CanvasDraw
                      className={classes.cardMedia}
                      canvasWidth={400}
                      canvasHeight={350}
                      disabled={true}
                      hideGrid={true}
                      saveData={img.image}
                    />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </div>
        <FooterScore />
      </div>
    );
  }
}

export default withStyles(styles)(PictureDisplays);
