import React, { Component } from 'react';
import '../App.css';

class Day extends Component {
    constructor(props: any) {
        super(props);
        this.state = {
          date: 0,
          weekday: "",
          isMajority: false
    
        }
      }
    
    render() {
        return (
            <div className="bg-blue-dark text-center h-screen">
                <div className= "py-1 mx-1 px-1">
                    <h3>Monday</h3>
                </div>
            </div>
        
        );
    }
}

export default Day;