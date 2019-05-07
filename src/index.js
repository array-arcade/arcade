import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app'
import {config} from './secrets'
import { Router } from 'react-router-dom'
import { Start } from './Start';
import {createMemoryHistory} from 'history'

const history = createMemoryHistory()


firebase.initializeApp(config)

export const db = firebase.firestore()

ReactDOM.render(
    <Router history={history}>
        <Start />
    </Router>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
