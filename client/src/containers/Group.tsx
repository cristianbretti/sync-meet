import React, { Component } from 'react'
import Sidebar from './Sidebar'
import Timebar from './Timebar'
import api from '../api/api'
import { RouteComponentProps } from 'react-router'
import {
    GetGroupCalendarResponse,
    MyDate,
    Time,
    SocketAdminENUM,
    LoginStatus,
    DayToEventsMap,
    ErrorResponse,
} from '../api/models'
import Calendar from './Calendar'
import AddUserModal from './AddUserModal'
import SpinningModal from './SpinningModal'
import SendLinkModal from './SendLinkModal'
import GroupDeletedModal from './GroupDeletedModal'

type GroupState = {
    status: LoginStatus
    shouldShowLink: boolean
    shouldShowGroupDeleted: boolean
} & GetGroupCalendarResponse

const dayInOneWeek = new Date()
dayInOneWeek.setDate(dayInOneWeek.getDate() + 7)

const emptyHashMap: DayToEventsMap = {}
const current = new Date()
let count = 0
while (current !== dayInOneWeek) {
    emptyHashMap[new MyDate({ date: current }).toString()] = []
    current.setDate(current.getDate() + 1)
    if (count >= 7) {
        break // safeguard
    }
    count++
}

const emptyGroupState: GetGroupCalendarResponse = {
    events: emptyHashMap,
    secondary: emptyHashMap,
    group: {
        meeting_length: new Time('01:00'),
        name: 'Meeting title',
        from_date: new MyDate({ date: new Date() }),
        to_date: new MyDate({ date: dayInOneWeek }),
        from_time: new Time('09:00'),
        to_time: new Time('17:00'),
    },
    owner_id: 0,
    users: [],
    your_id: 0,
}

class Group extends Component<RouteComponentProps<any>, GroupState> {
    constructor(props: RouteComponentProps<any>) {
        super(props)
        this.state = {
            ...emptyGroupState,
            status: LoginStatus.INITIAL_LOAD,
            shouldShowLink: false,
            shouldShowGroupDeleted: false,
        }
    }
    componentDidMount() {
        if (this.props.location.state) {
            //This is only true when redirected from /creategroup
            this.setState({ shouldShowLink: true })
        }
        api.setAdminEventCallback(this.handleSocketIO)
        this.handleSocketIO(SocketAdminENUM.JOIN)
    }

    handleSocketIO = (message: SocketAdminENUM) => {
        switch (message) {
            case SocketAdminENUM.JOIN:
            case SocketAdminENUM.LEAVE:
            case SocketAdminENUM.UPDATE:
                const group_str_id = this.props.match.params.group_str_id
                const loggedIn = api.isLoggedIn(group_str_id)
                if (!loggedIn.success) {
                    this.setState({ status: LoginStatus.NOT_LOGGED_IN })
                } else {
                    const google_id = loggedIn.google_id
                    this.getCalendarData(group_str_id, google_id)
                }
                break
            case SocketAdminENUM.DELETE:
                this.setState({ shouldShowGroupDeleted: true })
                break
        }
    }

    addUserFailed = (error: ErrorResponse) => {
        this.props.history.push({
            pathname: '/error',
            state: {
                errorMessage: error.error,
            },
        })
    }

    getCalendarData = (group_str_id: string, google_id: string) => {
        if (this.state.status === LoginStatus.NOT_LOGGED_IN) {
            this.setState({ status: LoginStatus.INITIAL_LOAD })
        }
        if (this.state.status !== LoginStatus.INITIAL_LOAD) {
            this.setState({ status: LoginStatus.UPDATING })
        }

        api.getGroupCalendar(google_id, group_str_id)
            .then((getGroupCalendarResponse: GetGroupCalendarResponse) => {
                this.setState({
                    group: getGroupCalendarResponse.group,
                    events: getGroupCalendarResponse.events,
                    secondary: getGroupCalendarResponse.secondary,
                    owner_id: getGroupCalendarResponse.owner_id,
                    users: getGroupCalendarResponse.users,
                    your_id: getGroupCalendarResponse.your_id,
                    status: LoginStatus.LOGGED_IN,
                })
                // Login has to be done here since it need the group end date.
                api.login(
                    group_str_id,
                    google_id,
                    getGroupCalendarResponse.group.to_date
                )
            })
            .catch((error: ErrorResponse) => {
                this.props.history.push({
                    pathname: '/error',
                    state: {
                        errorMessage: error.error,
                    },
                })
            })
    }

    closeSendLinkModal = () => {
        this.setState({ shouldShowLink: false })
    }

    closeGroupDeletedModal = () => {
        this.setState({ shouldShowGroupDeleted: false })
    }

    render() {
        return (
            <div className="relative overflow-hidden">
                <div
                    className={
                        'flex' +
                        ' ' +
                        (this.state.status === LoginStatus.NOT_LOGGED_IN ||
                        this.state.status === LoginStatus.INITIAL_LOAD ||
                        this.state.shouldShowLink ||
                        this.state.shouldShowGroupDeleted
                            ? 'blur'
                            : '')
                    }
                >
                    <Sidebar
                        {...this.state}
                        className="flex-1 h-screen border border-black"
                        group_str_id={this.props.match.params.group_str_id}
                        redirect={this.props.history.push}
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
                                secondary={this.state.secondary}
                            />
                        </div>
                        <div className="h-4 " />
                    </div>
                </div>
                {this.state.status === LoginStatus.INITIAL_LOAD && (
                    <SpinningModal />
                )}
                {this.state.status === LoginStatus.NOT_LOGGED_IN && (
                    <AddUserModal
                        group_str_id={this.props.match.params.group_str_id}
                        getCalendarData={this.getCalendarData}
                        addUserFailed={this.addUserFailed}
                    />
                )}
                {this.state.shouldShowLink &&
                    this.state.status !== LoginStatus.UPDATING &&
                    this.state.status !== LoginStatus.INITIAL_LOAD && (
                        <SendLinkModal
                            closeSendLinkModal={() => this.closeSendLinkModal()}
                        />
                    )}
                {this.state.shouldShowGroupDeleted && (
                    <GroupDeletedModal
                        closeGroupDeletedModal={() =>
                            this.closeGroupDeletedModal()
                        }
                    />
                )}
            </div>
        )
    }
}

export default Group
