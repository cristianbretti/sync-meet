import React, { Component } from 'react'
import { CalendarEvent } from '../api/models'
import {
    getEarliestTimeFromDates,
    getLatestTimeFromDates,
} from '../utils/helpers'

interface TimebarProps {
    events: CalendarEvent[]
}

const Timebar: React.FC<TimebarProps> = ({ events }) => {
    const earliest = getEarliestTimeFromDates(events)
    const latest = getLatestTimeFromDates(events)
    return (
        <div className="h-screen text-center">
            <div className="flex flex-col h-screen">
                <div className="w-full bg-grey-light h-16 " />

                <div className="w-full bg-grey flex-1 flex flex-col justify-between">
                    <h6 className="p-2">{earliest.toString()}</h6>
                    <h6 className="p-2">{latest.toString()}</h6>
                </div>
            </div>
        </div>
    )
}

export default Timebar
