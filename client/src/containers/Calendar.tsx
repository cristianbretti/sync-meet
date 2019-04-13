import React from 'react'
import { GetGroupCalendarResponse, MyDate, CalendarEvent } from '../api/models'
import Day from './Day'

interface CalendarProps {
    events: GetGroupCalendarResponse['events']
    secondary: GetGroupCalendarResponse['secondary']
    group: GetGroupCalendarResponse['group']
}

interface DayObject {
    date: MyDate
    events: CalendarEvent[]
    secondary: CalendarEvent[]
}

const Calendar: React.FC<CalendarProps> = ({
    events,
    secondary,
    group,
}: CalendarProps) => {
    const getDaysBetweenStartEnd = (from: MyDate, to: MyDate): DayObject[] => {
        let listOfDays = []
        const current = new Date(from.date)
        while (new MyDate({ date: current }).toString() !== to.toString()) {
            listOfDays.push({
                date: new MyDate({ date: current }),
                events: [],
                secondary: [],
            })
            current.setDate(current.getDate() + 1)
        }
        listOfDays.push({
            date: new MyDate({ date: current }),
            events: [],
            secondary: [],
        })
        return listOfDays
    }

    const days = getDaysBetweenStartEnd(group.from_date, group.to_date)
    return (
        <div className="flex overflow-x-auto w-full">
            {days.map((day, idx) => (
                <Day
                    className={'min-w-1/7 flex-1'}
                    key={idx}
                    events={events[day.date.toString()]}
                    secondary={secondary[day.date.toString()]}
                    thisDay={day.date}
                    fromTime={group.from_time}
                    toTime={group.to_time}
                />
            ))}
        </div>
    )
}

export default Calendar
