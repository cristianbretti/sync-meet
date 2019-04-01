import React, { Component } from 'react'
import { Time } from '../api/models'

interface TimebarProps {
    from_time: Time
    to_time: Time
}

const Timebar: React.FC<TimebarProps> = ({ from_time, to_time }) => {
    return (
        <div className="h-screen text-center">
            <div className="flex flex-col h-screen">
                <div className="w-full bg-grey-light h-16 " />

                <div className="w-full bg-grey flex-1 flex flex-col justify-between">
                    <h6 className="p-2">{from_time.toString()}</h6>
                    <h6 className="p-2">{to_time.toString()}</h6>
                </div>
            </div>
        </div>
    )
}

export default Timebar
