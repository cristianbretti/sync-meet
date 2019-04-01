import React, { Component } from 'react'
import { DBUser, GroupInfo } from '../api/models'
import Day from './Day'

import {
    getUniqueDaysFromListOfEvents,
    getEarliestTimeFromDates,
    getLatestTimeFromDates,
} from '../utils/helpers'

interface CalendarProps {
    events: GroupInfo['events']
}

const Calendar: React.FC<CalendarProps> = ({ events }: CalendarProps) => {
    const uniqueDays = getUniqueDaysFromListOfEvents(events)
    const earliestTime = getEarliestTimeFromDates(events)
    const latestTime = getLatestTimeFromDates(events)

    return (
        <div className="flex-1 flex">
            {uniqueDays.map((day, idx) => (
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
