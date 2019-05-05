import React from 'react';
import TextField from '@material-ui/core/TextField';
import Face from '@material-ui/icons/Face';
import DialPad from '@material-ui/icons/Dialpad';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import 'firebase/firestore';

class PhoneHome extends React.Component {
  constructor() {
    super();
    this.state = {
      user: '',
      roomNum: '',
    };
  }

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  // addUser = () => {
  //   let db = firebase.firestore();
  //   let roomNumber = this.state.roomNum;
  // };

  render() {
    const { user } = this.state;

    return (
      <div>
        <header className="header">
          <img src={require('./logo.png')} alt="logo" />
        </header>
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Card alignitems="center" justify="center">
            <CardContent>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignitems: 'center',
                  padding: '7px',
                }}
              >
                <Face />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignitems: 'center',
                  border: '75px',
                  padding: '7px',
                }}
              >
                <TextField
                  id="input-with-icon-grid"
                  label="Name"
                  name="user"
                  value={this.state.user}
                  onChange={this.handleChange}
                />
              </div>
              {/* <Divider variant="middle" align="vertically" /> */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignitems: 'center',
                  border: '75px',
                  padding: '7px',
                }}
              >
                <DialPad />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignitems: 'center',
                  border: '75px',
                  padding: '7px',
                }}
              >
                <TextField
                  id="input-with-icon-grid"
                  label="Room Code"
                  name="roomNum"
                  value={this.state.roomNum}
                  onChange={this.handleChange}
                />
              </div>
            </CardContent>
            <CardActions>
              <Button
                size="large"
                color="primary"
                fullWidth={true}
                // onClick={() => {
                //   this; }}
              >
                Submit
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    );
  }
}

export default PhoneHome;
