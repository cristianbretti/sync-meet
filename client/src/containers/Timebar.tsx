import React, { Component } from 'react';

interface DayProps {}

interface DayState {
    fromDate: string,
    toDate: string
}

class Timebar extends Component {
    constructor(props: any) {
        super(props);
        this.state = {
            fromTime: "",
            toTime: ""

        }
      }
    
    render() {
        return (
            <div className="h-screen text-center">
                <div className="flex flex-wrap">
                    <div className="w-full bg-grey-light h-16 ">
                    </div>

                    <div className="w-full bg-grey h-12">
                        <h6>4:pm</h6>
                    </div>
                    
                    <div className="w-full bg-grey-light h-12"></div>
                    <div className="w-full bg-grey h-12"></div>
                    <div className="w-full bg-grey-light h-12"></div>
                </div>
            </div>
        
        );
    }
}

export default Timebar;