import React, { Component } from 'react';
import '../App.css';
import Sidebar from './Sidebar'


class Calendar extends Component {
  render() {
    return (
      <div>
        <div className="flex">
          <div className="w-1/5 h-screen bg-green">
            <Sidebar></Sidebar>
          </div>  
            




          <div className="w-4/5 h-screen">  {/* The calendar goes in here */}
            <div className="flex">
              <div className="w-8 bg-yellow h-screen"></div>
              <div className="flex-1 bg-grey-light h-screen"></div> {/* One day takes up one fifth of the space*/}
              <div className="flex-1 bg-grey h-screen"></div>
              <div className="flex-1 bg-grey-light h-screen"></div>
              <div className="flex-1 bg-grey h-screen"></div>
              <div className="flex-1 bg-grey-light h-screen"></div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;