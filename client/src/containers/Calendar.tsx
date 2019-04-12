import React from 'react'
import { GetGroupCalendarResponse, MyDate, CalendarEvent } from '../api/models'
import Day from './Day'

interface CalendarProps {
    events: GetGroupCalendarResponse['events']
    all_but_one: GetGroupCalendarResponse['all_but_one']
    group: GetGroupCalendarResponse['group']
}

interface DayObject {
    date: MyDate
    events: CalendarEvent[]
    all_but_one: CalendarEvent[]
}

const Calendar: React.FC<CalendarProps> = ({
    events,
    all_but_one,
    group,
}: CalendarProps) => {
    const getDaysBetweenStartEnd = (from: MyDate, to: MyDate): DayObject[] => {
        let listOfDays = []
        const current = new Date(from.date)
        while (new MyDate({ date: current }).toString() !== to.toString()) {
            listOfDays.push({
                date: new MyDate({ date: current }),
                events: [],
                all_but_one: [],
            })
            current.setDate(current.getDate() + 1)
        }
        listOfDays.push({
            date: new MyDate({ date: current }),
            events: [],
            all_but_one: [],
        })
        return listOfDays
    }

    const matchEvents = (days: DayObject[], events: CalendarEvent[]) => {
        events.forEach(event => {
            // time difference
            const timeDiff = Math.abs(
                event.date.date.getTime() - group.from_date.date.getTime()
            )
            // days difference
            const index = Math.ceil(timeDiff / (1000 * 3600 * 24))
            days[index].events.push(event)
        })
    }
    const matchAllButOnes = (days: DayObject[], events: CalendarEvent[]) => {
        events.forEach(event => {
            // time difference
            const timeDiff = Math.abs(
                event.date.date.getTime() - group.from_date.date.getTime()
            )
            // days difference
            const index = Math.ceil(timeDiff / (1000 * 3600 * 24))
            days[index].all_but_one.push(event)
        })
    }

    const days = getDaysBetweenStartEnd(group.from_date, group.to_date)
    matchEvents(days, events)
    matchAllButOnes(days, all_but_one)
    return (
        <div className="flex overflow-x-auto w-full">
            {days.map((day, idx) => (
                <Day
                    className={'min-w-1/7'}
                    key={idx}
                    events={day.events}
                    all_but_one={day.all_but_one}
                    thisDay={day.date}
                    fromTime={group.from_time}
                    toTime={group.to_time}
                />
            ))}
        </div>
    )
}

export default Calendar
