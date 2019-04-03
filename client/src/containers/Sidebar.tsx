import React, { Component } from 'react'
import { DBUser, GroupInfo } from '../api/models'

type SiderbarProps = GroupInfo & { className?: string }

const userDisplay = (user: DBUser) => (
    <div key={user.id} className="text-center">
        <h4 className="py-1 px-1 mx-1 text-center">{user.name}</h4>
    </div>
)

const Sidebar: React.FC<SiderbarProps> = ({
    group,
    users,
    you,
    owner,
    className,
}: SiderbarProps) => {
    return (
        <div className={'bg-grey-darkest text-white' + ' ' + className}>
            <div className="text-center">
                <h3 className="py-1 px-1 mx-1 text-center">{group.name}</h3>
            </div>
            <div className="py-3 my-3 px-1 mx-1 flex">
                {' '}
                {/* This is the fromDate*/}
                <div className="flex-1 text-center">
                    <h4>From date</h4>
                </div>
                <div className="flex-1 text-center">
                    <h4>{group.from_date.toString()}</h4>
                </div>
            </div>

            <div className="py-3 my-3 px-1 mx-1 flex">
                {' '}
                {/* This is the toDate */}
                <div className="flex-1 text-center">
                    <h4>To date</h4>
                </div>
                <div className="flex-1 text-center">
                    <h4>{group.to_date.toString()}</h4>
                </div>
            </div>

            <div className="py-3 my-3 px-1 mx-1 flex">
                {' '}
                {/* This is the fromTime */}
                <div className="flex-1 text-center">
                    <h4>From time</h4>
                </div>
                <div className="flex-1 text-center">
                    <h4>{group.from_time.toString()}</h4>
                </div>
            </div>

            <div className="py-3 my-3 px-1 mx-1 flex">
                {' '}
                {/* This is the toTime */}
                <div className="flex-1 text-center">
                    <h4>To time</h4>
                </div>
                <div className="flex-1 text-center">
                    <h4>{group.to_time.toString()}</h4>
                </div>
            </div>

            <div className="py-3 my-3 px-1 mx-1 flex border-b border-black">
                {' '}
                {/* This is the meeting time */}
                <div className="flex-1 text-center">
                    <h4>Meeting time</h4>
                </div>
                <div className="flex-1 text-center">
                    <h4>{group.meeting_length.toString()}</h4>
                </div>
            </div>

            <div className="text-center">
                <h3 className="py-1 px-1 mx-1 text-center">Members</h3>
            </div>

            {users.map(user => userDisplay(user))}
        </div>
    )
}

export default Sidebar
