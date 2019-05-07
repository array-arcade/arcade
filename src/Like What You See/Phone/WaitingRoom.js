import React from "react";

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

    componentWillUpdate() {
        console.log(this.state, this.props)
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
