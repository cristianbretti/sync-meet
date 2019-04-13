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

    // const matchEvents = (
    //     days: DayObject[],
    //     events: CalendarEvent[],
    //     primary: boolean
    // ) => {
    //     events.forEach(event => {
    //         // time difference
    //         const timeDiff = Math.abs(
    //             event.date.date.getTime() - group.from_date.date.getTime()
    //         )
    //         // days difference
    //         const index = Math.ceil(timeDiff / (1000 * 3600 * 24))

    //         primary
    //             ? days[index].events.push(event)
    //             : days[index].secondary.push(event)
    //     })
    // }

    const days = getDaysBetweenStartEnd(group.from_date, group.to_date)
    // matchEvents(days, events, true)
    // matchEvents(days, secondary, false)
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
