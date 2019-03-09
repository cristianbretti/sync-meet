import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import GoogleLogin from 'react-google-login';

class OwnerStart extends Component {

  render() {
    return (
      <div className="text-center">
        <header className="App-header bg-blue">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to relo
          </p>
          <GoogleLogin
            clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            scope={'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'}
  />
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

const responseGoogle = (response: any) => {
  console.log(response);

}

export default OwnerStart;
