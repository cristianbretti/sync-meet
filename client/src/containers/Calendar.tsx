import React, { Component } from 'react';
import Sidebar from './Sidebar'
import Day from './Day'
import Timebar from './Timebar'


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
          <div className="w-1/5 h-screen border border-black">
            <Sidebar></Sidebar>
          </div>  
          
          <div className="w-4/5 h-screen">  {/* The calendar goes in here */}
            <div className="flex">

              <div className="w-1/40 h-screen border-t border-black"> {/* The timebar component goes in here */}
                <Timebar></Timebar>
              
              </div> 

              <div className="w-39/40 overflow-x-auto flex flex-no-wrap">
              
                <div className="w-1/7 flex-none border border-black">
                  <Day></Day> {/* One day takes up one seventh of the space*/}
                </div>

                
                
                
                
                
              
              </div>
              
              
              


            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;