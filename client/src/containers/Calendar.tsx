import React, { Component } from 'react'
import { DBUser, GroupInfo, Time, MyDate } from '../api/models'
import Day from './Day'

import {
    getEarliestTimeFromDates,
    getLatestTimeFromDates,
} from '../utils/helpers'

interface CalendarProps {
    events: GroupInfo['events']
    group: GroupInfo['group']
}

const Calendar: React.FC<CalendarProps> = ({
    events,
    group,
}: CalendarProps) => {
    const getDaysBetweenStartEnd = (from: MyDate, to: MyDate): MyDate[] => {
        let listOfDays = []
        const current = new Date(from.date)
        while (new MyDate({ date: current }).toString() !== to.toString()) {
            listOfDays.push(new MyDate({ date: current }))
            current.setDate(current.getDate() + 1)
        }
        listOfDays.push(new MyDate({ date: current }))
        return listOfDays
    }

    const days = getDaysBetweenStartEnd(group.from_date, group.to_date)
    const earliestTime = getEarliestTimeFromDates(events)
    const latestTime = getLatestTimeFromDates(events)

    return (
        <div className="flex-1 flex">
            {days.map((day, idx) => (
                <Day
                    key={idx}
                    events={events}
                    thisDay={day}
                    earliest={earliestTime}
                    latest={latestTime}
                />
            ))}
        </div>
    )
}

export default Calendar
