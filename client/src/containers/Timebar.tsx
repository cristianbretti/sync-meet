import React from 'react'
import { Time } from '../api/models'

interface TimebarProps {
    from_time: Time
    to_time: Time
}

const Timebar: React.FC<TimebarProps> = ({ from_time, to_time }) => {
    let numberOfHoursBetweenStartEnd =
        to_time.getHours() -
        from_time.getHours() +
        (to_time.getMinutes() > 0 ? 1 : 0)
    return (
        <div className="h-full w-8 flex flex-col border-r border-black">
            <div className="w-full h-16 border-b border-black" />

            {Array.from(Array(numberOfHoursBetweenStartEnd)).map((v, idx) => {
                const hour = from_time.getHours() + idx
                return (
                    <div key={idx} className="flex flex-col flex-1">
                        <div className="flex-1 border-b border-dotted text-2xs">
                            {hour < 10 ? '0' + hour + ':00' : hour + ':00'}
                        </div>
                        <div className="flex-1 border-b" />
                    </div>
                )
            })}
        </div>
    )
}

export default Timebar
