import React from "react";
import { db } from "../../index";
import Button from "@material-ui/core/Button";
import ImageSearch from "@material-ui/icons/ImageSearch";
import giphyRandom from "giphy-random";
import { giphyKey } from "../../secrets";

export class WaitingRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      roomNum: 0,
      game: {},
      user: {},
      gif: "",
      pageChange: false
    };
  }

  handleClick = async () => {
    let { data } = await giphyRandom(giphyKey, {
      tag: "cats",
      rating: "pg"
    });
    this.setState({ gif: data.image_url });
  };

  componentDidMount() {
    const { roomNum, currentGame, user } = this.props.location.state;
    let currentPlayer;
    const room = db
      .collection("games")
      .doc(`${currentGame.name}`)
      .collection("rooms")
      .doc(`${roomNum}`);
    let player = room.collection("users").doc(`${user.name}`);
    this.playerUnsub = player.onSnapshot(snapshot => {
      currentPlayer = snapshot.data();
      this.setState({ user: currentPlayer });
    });
    this.setState({ roomNum, game: currentGame });
    this.roomUnsub = room.onSnapshot(snapshot => {
      let doc = snapshot.data();
      if (doc.judgeChange) {
        this.setState({ pageChange: true });
        player.update({ refNum: null });
      }
      if (doc.winner) {
        return this.props.history.push({
          pathname: "/winner",
          state: { roomNum, game: currentGame, user: this.state.user }
        });
      }
    });
  }

  
  componentWillUnmount() {
    this.playerUnsub();
    this.roomUnsub();
  }

  render() {
    const { roomNum, game, user, pageChange, gif } = this.state;
    const roomRender = () => {
      if (user.isJudge && pageChange) {
        return this.props.history.push({
          pathname: `/word-pick`,
          state: { roomNum, game, user }
        });
      } else if (pageChange) {
        return this.props.history.push({
          pathname: `/draw`,
          state: { roomNum, game, user }
        });
      } else {
        return (
          <div className="h1Mobile">
            <h1>Welcome to the waiting room.</h1>
            <div>
              <Button
                onClick={() => {
                  this.handleClick();
                }}
              >
                Generate a gif!
                <ImageSearch />
              </Button>
              <div className="GifDiv">
                {gif ? <img src={gif} alt="cat gif" /> : null}
              </div>
            </div>
          </div>
        );
      }
    };
    return <div>{roomRender()}</div>;
  }
}
