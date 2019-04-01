import React from 'react';
import Event from './Event'
import { CalendarEvent, MyDate, Time } from '../api/models';


interface DayProps {
    events: CalendarEvent[],
    thisDay: MyDate,
    earliest: Time,
    latest: Time,
}

const Day:React.FC<DayProps> = ({events, thisDay, earliest, latest}) =>  {
    console.log(earliest)
    console.log(latest)
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