import React from 'react';
import CanvasDraw from 'react-canvas-draw';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';

class PictionaryHome extends React.Component {
  handleClick = () => {
    let db = firebase.firestore();
    let dbGames = db
      .collection('games')
      .doc('Like What You See?')
      .collection('rooms')
      .doc('5589')
      .collection('users')
      .doc('Tim');
    dbGames.set(
      {
        image: this.saveableCanvas.getSaveData(),
      },
      { merge: true }
    );
  };
  render() {
    return (
      <div>
        <CanvasDraw
          ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
          hideGrid={true}
          brushRadius={3}
          lazyRadius={10}
          brushColor="#000000"
          style={{
            boxShadow:
              '0 13px 27px -5px rgba(20, 20, 63, 0.1),    0 2px 3px -2px rgba(1, 200, 1, 0.3)',
          }}
        />
        <Button
          size="medium"
          color="primary"
          fullWidth={true}
          onClick={() => {
            this.saveableCanvas.clear();
          }}
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            this.saveableCanvas.undo();
          }}
        >
          Undo
        </Button>
        <Button
          size="medium"
          color="primary"
          fullWidth={true}
          onClick={() => {
            this.handleClick();
          }}
        >
          Submit
        </Button>
      </div>
    );
  }
}

export default PictionaryHome;
