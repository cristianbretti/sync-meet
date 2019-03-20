import React, { Component } from 'react';

interface EventProps {}

interface EventState {
    fromTime: string,
    toTime: string,
    isMajority: boolean
}

class Event extends Component {
    constructor(props: EventProps) {
        super(props);
        this.state = {
          fromTime: "13:00",
          toTime: "16:00",
          isMajority: false
    
        }
      }
    
    render() {
        return (
            <div className="bg-blue-dark px-1 h-12">
                <div>
                    <h6>Event</h6>
                </div>
            </div>
        
        );
    }
}

export default Event;