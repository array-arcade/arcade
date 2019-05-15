import React from "react";
import { db } from "../../index";
import { Button, Typography, Divider } from "@material-ui/core";
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

  async componentDidMount() {
    let { roomNum, currentGame, user } = this.props.location.state;
    this.setState({ roomNum, game: currentGame, user });
    let currentPlayer;
    const room = db
      .collection("games")
      .doc(`${currentGame.name}`)
      .collection("rooms")
      .doc(`${roomNum}`);
    let player = room.collection("users").doc(`${user.name}`);
    await player.get().then(snapshot => {
      this.setState({user: snapshot.data()})
    })
    this.playerUnsub = player.onSnapshot(snapshot => {
      currentPlayer = snapshot.data();
      this.setState({ user: currentPlayer });
    });
    this.roomUnsub = room.onSnapshot(snapshot => {
      let doc = snapshot.data();
      if (doc.judgeChange) {
        this.setState({ pageChange: true });
        player.update({ refNum: null, submitted: false });
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
      if (user && user.isJudge && pageChange) {
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
            <Typography variant="h3">Like What You See?</Typography>
            <Typography variant="body1">
              Artists: The judge will select a prompt which will appear on the
              browser. As an artist, it is your job to draw that prompt to the
              best of your abilities within the time frame given. When the timer
              starts to reach its end, the music will speed up!
            </Typography>
            <Divider />
            <Typography variant="body1">
              Judge: Pick a prompt for the artists to draw and choose the one
              that strikes your fancy! Whoever you choose will become the judge
              for the next round.
            </Typography>
            <Divider />
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
