import React, { Component } from 'react'
import { DBUser, GroupInfo } from '../api/models'
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';
import api from '../api/api';

type SiderbarProps = GroupInfo & { className?: string } & {group_str_id: string}

const userDisplay = (user: DBUser) => (
    <div key={user.id} className="text-center">
        <h4 className="py-1 px-1 mx-1 text-center">{user.name}</h4>
    </div>
)

const leaveGroup = (you: number, owner: DBUser, group_str_id: string) => {
    console.log(group_str_id)
    const loggedIn = api.isLoggedIn(group_str_id)
    if (loggedIn.success) {
        api.remove(you == owner.id, loggedIn.google_id, group_str_id)
    } 
                    
}

const Sidebar: React.FC<SiderbarProps> = ({
    group,
    users,
    you,
    owner,
    className,
    group_str_id
}: SiderbarProps) => {
    return (
        <div className={'relative bg-grey-darkest text-white' + ' ' + className}>
            <div className="text-center">
                <h3 className="py-3 px-1 mx-1 text-center">{group.name}</h3>
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

            <div className="text-center absolute pin-b pin-r">
                
                <button onClick={() => leaveGroup(you, owner, group_str_id)} className="m-3 p-2 no-underline text-inherit p-2 rounded bg-red-dark hover:bg-red-darker hover:shadow-inner shadow">
                    {owner ? 'Delete group' : 'Leave group'}
                </button>
            
            </div>

        </div>
    )
}

export default Sidebar
