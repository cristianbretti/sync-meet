import React, { Component } from 'react'
import { Time } from '../api/models'

interface EventProps {
    className?: string
    eventStart: Time
    eventEnd: Time
    fromTime: Time
    toTime: Time
}

const Event: React.FC<EventProps> = ({
    eventStart,
    className,
    eventEnd,
    fromTime,
    toTime,
}) => {
    const roundedToTime =
        toTime.getMinutes() > 0
            ? new Time(toTime.getHours() + 1 + ':00')
            : new Time(toTime.getHours() + ':00')

    // time difference in minutes
    const fromStartOfDay =
        (eventStart.getHours() - fromTime.getHours()) * 60 +
        eventStart.getMinutes() -
        fromTime.getMinutes()

    const hours = roundedToTime.getHours() === 0 ? 24 : roundedToTime.getHours()
    const totalViewLength =
        (hours - fromTime.getHours()) * 60 +
        roundedToTime.getMinutes() -
        fromTime.getMinutes()

    const eventLengthInMinutes =
        (eventEnd.getHours() - eventStart.getHours()) * 60 +
        eventEnd.getMinutes() -
        eventStart.getMinutes()

    const offset = (fromStartOfDay / totalViewLength) * 100
    const height = (eventLengthInMinutes / totalViewLength) * 100

    return (
        <div
            className={
                className +
                ' ' +
                'absolute pin-x border rounded opacity-80 z-10 ml-px mr-1 -mt-px'
            }
            style={{
                top: offset + '%',
                height: 'calc(' + height + '%)',
            }}
        >
            <div className="text-sm font-semibold p-1">
                {eventStart.toString() + ' - ' + eventEnd.toString()}
            </div>
        </div>
    )
}

export default Event
