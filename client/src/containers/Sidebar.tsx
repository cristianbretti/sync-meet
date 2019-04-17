import React from 'react'
import {
    DBUser,
    GetGroupCalendarResponse,
    UpdateAccessTokenBody,
    LoginStatus,
} from '../api/models'
import SpinnerComponent from '../components/SpinnerComponent'
import api from '../api/api'
import GoogleLogin from 'react-google-login'
import { LocationDescriptorObject } from 'history'

type SiderbarProps = GetGroupCalendarResponse & {
    className?: string
    status: LoginStatus
    group_str_id: string
    redirect(path: string, state?: any): void
    redirect(location: LocationDescriptorObject<any>): void
}

const Sidebar: React.FC<SiderbarProps> = ({
    group,
    users,
    your_id,
    owner_id,
    className,
    status,
    group_str_id,
    redirect,
}: SiderbarProps) => {
    const userDisplay = (user: DBUser) => (
        <div key={user.id}>
            <div className="px-2 text-center">
                <h4>
                    {user.name}
                    {showPersonIcon(user)}
                    {showOwnerIcon(user)}
                    {showRefreshIcon(user)}
                </h4>
            </div>
        </div>
    )

    const showOwnerIcon = (user: DBUser) => {
        if (user.id == owner_id) {
            return (
                <i className="material-icons px-1 text-xs text-yellow-light">
                    star
                </i>
            )
        }
    }

    const showPersonIcon = (user: DBUser) => {
        if (your_id == user.id) {
            return (
                <i className="material-icons px-1 text-xs text-blue-dark">
                    accessibility
                </i>
            )
        }
    }

    const refreshUserToken = (googleResponse: any) => {
        const update_access_token_body: UpdateAccessTokenBody = {
            access_token: googleResponse.getAuthResponse().access_token,
        }

        const loggedIn = api.isLoggedIn(group_str_id)
        if (loggedIn.success) {
            const google_id = loggedIn.google_id
            api.updateAccessToken(
                update_access_token_body,
                google_id,
                group_str_id
            )
        }
    }

    const showRefreshIcon = (user: DBUser) => {
        if (!user.valid) {
            if (your_id == user.id) {
                return (
                    <GoogleLogin
                        clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                        render={renderProps => (
                            <button
                                onClick={
                                    renderProps
                                        ? renderProps.onClick
                                        : () => console.log('undefined')
                                }
                            >
                                <i className="material-icons px-1 text-xs text-center text-grey-lightest">
                                    refresh
                                </i>
                            </button>
                        )}
                        onFailure={() => {
                            redirect({
                                pathname: '/error',
                                state: {
                                    errorMessage:
                                        'Could not authenticate google user',
                                },
                            })
                        }}
                        onSuccess={refreshUserToken}
                        scope={
                            'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
                        }
                        cookiePolicy={'single_host_origin'}
                    />
                )
            } else {
                return (
                    <i className="material-icons pl-1 text-xs text-grey-lighter">
                        warning
                    </i>
                )
            }
        }
    }

    const leaveGroup = () => {
        const loggedIn = api.isLoggedIn(group_str_id)
        if (loggedIn.success) {
            api.remove(
                your_id == owner_id,
                loggedIn.google_id,
                group_str_id
            ).then(resp => {
                redirect('/')
            })
        }
    }

    const copyLink = () => {
        var dummy = document.createElement('input'),
            text = window.location.href
        document.body.appendChild(dummy)
        dummy.value = text
        dummy.select()
        document.execCommand('copy')
        document.body.removeChild(dummy)
    }

    return (
        <div
            className={'relative bg-grey-darkest text-white' + ' ' + className}
        >
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

            {users.map(user => userDisplay(user))}
            {status === LoginStatus.UPDATING && <SpinnerComponent />}
            <div className="text-center absolute pin-b pin-r flex ">
                <button
                    onClick={copyLink}
                    className="m-2 no-underline text-inherit p-2 rounded bg-grey-dark hover:bg-grey-darker hover:shadow-inner shadow"
                >
                    Copy Link
                    <i className="material-icons pl-2 text-xs"> file_copy </i>
                </button>

                <button
                    onClick={() => leaveGroup()}
                    className="m-2 no-underline text-inherit p-2 rounded bg-red-dark hover:bg-red-darker hover:shadow-inner shadow"
                >
                    {owner_id == your_id ? 'Delete group' : 'Leave group'}
                </button>
            </div>
        </div>
    )
}

export default Sidebar
