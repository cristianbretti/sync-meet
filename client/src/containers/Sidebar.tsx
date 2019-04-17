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
import SidebarIcon from '../components/SidebarIcon'

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
        <div
            key={user.id}
            className="flex text-xl my-2 p-1 rounded bg-grey-dark shadow-inner"
        >
            {user.name}
            <div className="flex-1" />
            <SidebarIcon
                className="text-yellow select-none"
                icon="star"
                invisible={user.id !== owner_id}
                text="This is the group owner"
            />
            {showRefreshIcon(user)}
        </div>
    )

    const showRefreshIcon = (user: DBUser) => {
        if (!user.valid) {
            if (your_id == user.id) {
                return (
                    <GoogleLogin
                        clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                        render={renderProps => (
                            <SidebarIcon
                                className="text-grey-lighest cursor-pointer hover:bg-grey-lightest hover:text-grey-dark rounded"
                                onClick={
                                    renderProps
                                        ? renderProps.onClick
                                        : undefined
                                }
                                icon="refresh"
                                invisible={user.id !== owner_id}
                                text="Refresh your google access"
                            />
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
                    <SidebarIcon
                        className="text-orange select-none"
                        icon="warning"
                        text="This user need to update their google login"
                    />
                )
            }
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

    const displayRow = (icon: string, first: string, second: string) => (
        <div className="py-3 my-3 flex">
            <div className="flex justify-center items-center">
                <i className={'text-3xl material-icons pr-4'}>{icon}</i>
            </div>
            <div className="text-md flex justify-center items-center">
                <div>{first}</div>
            </div>
            <div className="flex justify-center items-center">
                <i key="arrow" className="material-icons px-4">
                    arrow_forward
                </i>
            </div>
            <div className="text-md flex justify-center items-center">
                <div>{second}</div>
            </div>
        </div>
    )

    return (
        <div
            className={
                'flex flex-col bg-grey-darkest text-white p-6' + ' ' + className
            }
        >
            <div className="py-3 text-center text-4xl font-semibold uppercase">
                {group.name}
            </div>

            <button
                onClick={copyLink}
                className="no-underline text-inherit p-2 rounded bg-green-darker hover:bg-green-dark hover:shadow-inner shadow outline-none focus:outline-none
                focus:bg-green-darkest"
            >
                copy invitation link
                <i className="material-icons pl-2 text-xs"> file_copy </i>
            </button>

            {displayRow(
                'calendar_today',
                group.from_date.toString(),
                group.to_date.toString()
            )}
            {displayRow(
                'access_time',
                group.from_time.toString(),
                group.to_time.toString()
            )}

            <div className="py-3 my-3 flex">
                <div className="flex justify-center items-center">
                    <i className={'text-3xl material-icons pr-4'}>
                        hourglass_full
                    </i>
                </div>
                <div className="text-md flex justify-center items-center">
                    <div>{group.meeting_length.toString()}</div>
                </div>
            </div>

            <div className="pt-4 text-2xl font-semibold uppercase">Members</div>

            <div className="flex-1 overflow-y-scroll pt-2">
                {users.map(user => userDisplay(user))}
            </div>
            {status === LoginStatus.UPDATING && <SpinnerComponent />}
            <div className="text-center pin-b pin-r flex ">
                <button
                    onClick={() => leaveGroup()}
                    className="no-underline text-inherit p-2 rounded bg-red-dark hover:bg-red-darker hover:shadow-inner shadow"
                >
                    {owner_id == your_id ? 'Delete group' : 'Leave group'}
                </button>
            </div>
        </div>
    )
}

export default Sidebar
