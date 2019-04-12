import React from 'react'
import Event from './Event'
import { CalendarEvent, MyDate, Time } from '../api/models'

interface DayProps {
    events: CalendarEvent[]
    all_but_one: CalendarEvent[]
    thisDay: MyDate
    fromTime: Time
    toTime: Time
    className?: string
}

const Day: React.FC<DayProps> = ({
    events,
    all_but_one,
    thisDay,
    fromTime,
    toTime,
    className,
}) => {
    let numberOfHoursBetweenStartEnd =
        toTime.getHours() -
        fromTime.getHours() +
        (toTime.getMinutes() > 0 ? 1 : 0)
    return (
        <div
            className={'flex flex-col border-r border-black' + ' ' + className}
        >
            <div className="h-16 border-b border-black text-center">
                <div className="px-1 pt-2 text-xl font-semibold">
                    <div>{thisDay.getDayString()}</div>
                    <div>{thisDay.getDate()}</div>
                </div>
            </div>
            <div className="flex-1 flex flex-col relative">
                {Array.from(Array(numberOfHoursBetweenStartEnd)).map(
                    (v, idx) => {
                        const hour = fromTime.getHours() + idx
                        return (
                            <div key={idx} className="flex flex-col flex-1">
                                <div className="flex-1 border-b border-dotted text-2xs" />
                                <div className="flex-1 border-b" />
                            </div>
                        )
                    }
                )}
                {events.map((event, idx) => (
                    <Event
                        key={idx}
                        eventStart={event.from_time}
                        eventEnd={event.to_time}
                        fromTime={fromTime}
                        toTime={toTime}
                    />
                ))}
                {all_but_one.map((event, idx) => (
                    <Event
                        className="bg-blue-dark"
                        key={idx}
                        eventStart={event.from_time}
                        eventEnd={event.to_time}
                        fromTime={fromTime}
                        toTime={toTime}
                    />
                ))}
            </div>
        </div>
    )
}

export default Day
