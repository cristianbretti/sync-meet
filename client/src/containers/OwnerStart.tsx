import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';

class OwnerStart extends Component {
  render() {
    return (
      <div className="text-center">
        <header className="App-header bg-blue">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to relo
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default OwnerStart;
