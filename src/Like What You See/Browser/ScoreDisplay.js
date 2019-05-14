import React from 'react';
import firebase from 'firebase';

class FooterScore extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      roomNumber: null,
      game: {},
      players: [],
    };
  }

  async componentDidMount() {
    let { roomNumber, players } = this.props;
    this.setState({ roomNumber, players });
    let db = firebase.firestore();
    let dbName = db
      .collection('games')
      .doc('Like What You See?')
      .collection('rooms')
      .doc(`${roomNumber}`)
      .collection('users');
    this.unsubscribe = dbName.onSnapshot(snapshot => {
      let players = snapshot.docs.map(doc => doc.data());
      this.setState({ players: players });
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div className="Footer">
        <footer>
          <div className="FooterScore">Scores!</div>
          {this.state.players.map(player => {
            // eslint-disable-next-line no-unused-expressions
            return (
              <span className="Span">
                {player.name}: {player.score}
              </span>
            );
          })}
        </footer>
      </div>
    );
  }
}

export default FooterScore;
