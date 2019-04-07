import React, { Component } from 'react'
import Sidebar from './Sidebar'
import Timebar from './Timebar'
import api from '../api/api'
import { RouteComponentProps } from 'react-router'
import {
    GetGroupCalendarResponse,
    GroupInfo,
    MyDate,
    Time,
    SocketENUM,
} from '../api/models'
import Calendar from './Calendar'
import AddUserModal from './AddUserModal'

enum LoginStatus {
    LOGGED_IN,
    NOT_LOGGED_IN,
    PENDING,
}

type GroupState = { status: LoginStatus } & GroupInfo

const dayInOneWeek = new Date()
dayInOneWeek.setDate(dayInOneWeek.getDate() + 7)

const emptyGroupState: GroupInfo = {
    events: [],
    group: {
        meeting_length: new Time('01:00'),
        name: 'Empty',
        from_date: new MyDate({ date: new Date() }),
        to_date: new MyDate({ date: dayInOneWeek }),
        from_time: new Time('09:00'),
        to_time: new Time('17:00'),
    },
    owner: {
        id: 0,
        name: '',
    },
    users: [],
    you: 0,
}

class Group extends Component<RouteComponentProps<any>, GroupState> {
    constructor(props: RouteComponentProps<any>) {
        super(props)
        this.state = { ...emptyGroupState, status: LoginStatus.PENDING }
    }

    componentDidMount() {
        const group_str_id = this.props.match.params.group_str_id
        const loggedIn = api.isLoggedIn(group_str_id)
        if (!loggedIn.success) {
            this.setState({ status: LoginStatus.NOT_LOGGED_IN })
        } else {
            const google_id = loggedIn.google_id
            this.getCalendarData(group_str_id, google_id)
        }
    }

    getCalendarData = (group_str_id: string, google_id: string) => {
        this.setState({ status: LoginStatus.PENDING })
        api.getGroupCalendar(google_id, group_str_id)
            .then((getGroupCalendarResponse: GetGroupCalendarResponse) => {
                if (!getGroupCalendarResponse.success) {
                    // TODO: something wrong
                    console.log('Access token expired!!')
                    console.log(getGroupCalendarResponse)
                    return
                }
                this.setState({
                    group: getGroupCalendarResponse.group,
                    events: getGroupCalendarResponse.events,
                    owner: getGroupCalendarResponse.owner,
                    users: getGroupCalendarResponse.users,
                    you: getGroupCalendarResponse.you,
                    status: LoginStatus.LOGGED_IN,
                })
                // Login has to be done here since it need the group end date.
                api.login(
                    group_str_id,
                    google_id,
                    getGroupCalendarResponse.group.to_date
                )
            })
            .catch((error: any) => {
                // TODO: Error handeling
                console.log('Error')
                console.log(error)
            })
    }

    render() {
        if (this.state.status === LoginStatus.PENDING) {
            return <div>SPINNING</div>
        }
        return (
            <div className="relative overflow-hidden">
                <div
                    className={
                        'flex' +
                        ' ' +
                        (this.state.status === LoginStatus.NOT_LOGGED_IN
                            ? 'blur'
                            : '')
                    }
                >
                    <Sidebar
                        {...this.state}
                        className="flex-1 h-screen border border-black"
                    />

                    <div className="flex-3 flex flex-col h-screen">
                        <div className="flex flex-1">
                            <Timebar
                                from_time={this.state.group.from_time}
                                to_time={this.state.group.to_time}
                            />
                            <Calendar
                                events={this.state.events}
                                group={this.state.group}
                            />
                        </div>
                        <div className="h-8 " />
                    </div>
                </div>
                {this.state.status === LoginStatus.NOT_LOGGED_IN && (
                    <AddUserModal
                        group_str_id={this.props.match.params.group_str_id}
                        getCalendarData={this.getCalendarData}
                    />
                )}
            </div>
        )
    }
}

export default Group
