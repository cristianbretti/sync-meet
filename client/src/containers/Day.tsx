import React from 'react';
import Event from './Event'
import { CalendarEvent, MyDate } from '../api/models';


interface DayProps {
    events: CalendarEvent[],
    thisDay: MyDate
}

const Day:React.FC<DayProps> = ({events, thisDay}) =>  {

    return (
        <div className="w-1/7 flex-none border border-black">
            <div className="text-center h-screen">
                <div className=" h-16">
                    <div className= "px-1">
                        <h3>{thisDay.getDayString()}</h3>
                    </div>
                    <div className= "px-1">
                        <h3>{thisDay.getDate()}</h3>
                    </div>
                    
                </div>
                <Event></Event>
                <div className="h-24"></div>
                <Event></Event>
            </div>
        </div>
    
    );
}


export default Day;