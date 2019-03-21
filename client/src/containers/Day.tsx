import React, { Component } from 'react';
import Event from './Event'
interface DayProps {}

interface DayState {
    date: string,
    weekday: string,
    isMajority: boolean
}

class Day extends Component {
    constructor(props: DayProps) {
        super(props);
        this.state = {
          date: "",
          weekday: "",
          isMajority: false
    
        }
      }
    
    render() {
        return (
            <div className="w-1/7 flex-none border border-black">
                <div className="text-center h-screen">
                    <div className=" h-16">
                        <div className= "px-1">
                            <h3>Monday</h3>
                        </div>
                        <div className= "px-1">
                            <h3>25</h3>
                        </div>
                        
                    </div>
                    <Event></Event>
                    <div className="h-24"></div>
                    <Event></Event>
                </div>
            </div>
        
        );
    }
}

export default Day;