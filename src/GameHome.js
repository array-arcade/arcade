import React from "react";
import firebase from "firebase/app";

class GameHome extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    let db = firebase.firestore();
    this.setState({
      game: this.props.location.state.game,
      roomNumber: this.props.location.state.roomNumber
    });
  }

  render() {
    const { game, roomNumber } = this.state;
    console.log(`Game:`, game);
    console.log(`Room:`, roomNumber);

    return <h1>Game Home Component</h1>;
  }
}

export default GameHome;
