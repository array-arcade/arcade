//This will display after a player has reached the score to win
//Can redirect either to the Lobby or the browser home depending
//on if the game is restarted or the room is destroyed

import React, {Component} from 'react'


export default class VictoryScreen extends Component {
    constructor() {
        super()
        this.state = {}
    }

    render(){
        return (
            <div>
                <h1>Inside victory screen</h1>
            </div>
        )
    }
}