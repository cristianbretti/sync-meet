import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {OwnerStart} from './containers/OwnerStart'

class App extends Component {
  render() {
    return (
      <Route exact path="/" component={OwnerStart}/>
    );
  }
}

export default App;
