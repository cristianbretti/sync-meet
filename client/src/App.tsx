import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import OwnerStart from './containers/OwnerStart'
import io from 'socket.io-client';

class App extends Component {

    componentDidMount() {
        const socket = io.connect('http://localhost:5000');
        socket.on('connect', () => {
            console.log("connected!")
            socket.send("User has connected!");
        })

        socket.on('message', (msg: String) => {
            console.log(msg);
        })
    }

    render() {
        return (
            <Route exact path="/" component={OwnerStart}/>
        );
    }
}

export default App;
