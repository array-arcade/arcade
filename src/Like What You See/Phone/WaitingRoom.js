import React from "react";
import DrawPad from './PlayerDrawPad'
import WordPick from './JudgeWordPick'

export class WaitingRoom extends React.Component {
    constructor() {
        super()
        this.state = {
            roomNum: 0,
            game: {},
            user: ''
        }
    }

    componentDidMount() {
        const {roomNum, game, user} = this.props.location.state
        this.setState({ roomNum, game, user})
    }

  render() {
      const {roomNum, game, user} = this.state
    return (
      <div>
        <h1>inside the waiting room!</h1>
      </div>
    );
  }
}
