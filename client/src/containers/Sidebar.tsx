import React, { Component } from 'react'
import { DBUser, GetGroupCalendarResponse, UpdateAccessTokenBody} from '../api/models'
import api from '../api/api';
import GoogleLogin from 'react-google-login';
import { access } from 'fs';

type SiderbarProps = GetGroupCalendarResponse & { className?: string } & {group_str_id: string}

const userDisplay = (user: DBUser, owner_id: number, your_id: number) => (
    <div key={user.id}>

        <div className="px-2 text-center">
            <h4>{user.name}{showPersonIcon(user, your_id)}{showOwnerIcon(user, owner_id)}{showRefreshIcon(user, your_id)}</h4>
         
        </div>
            

        
    </div>
)

const showOwnerIcon = (user: DBUser, owner_id: number) => {
    if(user.id == owner_id){
        return(<i className="material-icons px-1 text-xs text-yellow-light">star</i>)
    }
}

const showPersonIcon = (user: DBUser, your_id: number) => {
    if(your_id == user.id){
        return(<i className="material-icons px-1 text-xs text-blue-dark">accessibility</i>)
    }
}

const refreshUserToken = (googleResponse: any) => {
    console.log("refresh")
    const update_access_token_body: UpdateAccessTokenBody = {
        access_token:  googleResponse.getAuthResponse().access_token
    }
    const group_str_id = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)
    const loggedIn = api.isLoggedIn(group_str_id)
    if (loggedIn.success) {
        const google_id = loggedIn.google_id
        api.updateAccessToken(update_access_token_body, google_id, group_str_id)
    }
}

const showRefreshIcon = (user: DBUser, your_id: number) => {
    if(!user.valid){
        if(your_id == user.id){
            return(
                <GoogleLogin 
                    clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                    render={renderProps => (
                    <button onClick={renderProps ? renderProps.onClick: () => console.log("undefined")}><i className="material-icons px-1 text-xs text-center text-grey-lightest">refresh</i></button>)}
                    onFailure={() => console.log("failure")} 
                    onSuccess={refreshUserToken} 
                    scope={
                        'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
                    }
                />
            )
        }
        else{
            return(<i className="material-icons pl-1 text-xs text-grey-lighter">warning</i>)
        }
    }
}

const leaveGroup = (your_id: number, owner_id: number, group_str_id: string) => {
    const loggedIn = api.isLoggedIn(group_str_id)
    if (loggedIn.success) {
        api.remove(your_id == owner_id, loggedIn.google_id, group_str_id)
    } 
                    
}

const copyLink = () =>{
    var dummy = document.createElement('input'),
    text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}

const Sidebar: React.FC<SiderbarProps> = ({
    group,
    users,
    your_id,
    owner_id,
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
                <h3 className="py-2 px-1 mx-1 text-center">Members</h3>
            </div>

            {users.map(user => userDisplay(user, owner_id, your_id))}

            <div className="text-center absolute pin-b pin-r flex ">

                <button onClick={copyLink} className="m-2 no-underline text-inherit p-2 rounded bg-grey-dark hover:bg-grey-darker hover:shadow-inner shadow">
                    Copy Link
                    <i className="material-icons pl-2 text-xs"> file_copy </i>
                </button>
                
                <button onClick={() => leaveGroup(your_id, owner_id, group_str_id)} className="m-2 no-underline text-inherit p-2 rounded bg-red-dark hover:bg-red-darker hover:shadow-inner shadow">
                    {owner_id == your_id ? 'Delete group' : 'Leave group'}
                </button>

            
            </div>

        </div>
    )
}

export default Sidebar
