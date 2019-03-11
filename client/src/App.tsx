import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import OwnerStart from './containers/OwnerStart'
import Calendar from './containers/Calendar'

class App extends Component {
  render() {
    return (
      <div>
      <Route exact path="/" component={OwnerStart}/>
      <Route path="/calendar" component={Calendar}/>
      </div>
      
    );
  }
}

export default App;
