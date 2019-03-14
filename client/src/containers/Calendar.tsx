import React, { Component } from 'react';
import '../App.css';
import Sidebar from './Sidebar'
import Day from './Day'

interface CalendarProps {}

interface CalendarState {
    days: [Day]
}


class Calendar extends Component {
  constructor(props: CalendarProps) {
    super(props);
    this.state = {
      days: []

    }
  }
  
  render() {
    return (
      <div>
        <div className="flex">
          <div className="w-1/5 h-screen bg-green border border-black">
            <Sidebar></Sidebar>
          </div>  
          
          <div className="w-4/5 h-screen">  {/* The calendar goes in here */}
            <div className="flex">

              <div className="w-8 bg-yellow h-screen"></div> {/* The timestamp component goes in here */}
              <div className="w-1/7">
                <Day></Day> {/* One day takes up one seventh of the space*/}
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;