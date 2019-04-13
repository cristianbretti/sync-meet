import React, { Component } from 'react'
import Sidebar from './Sidebar'
import Timebar from './Timebar'
import api from '../api/api'
import { RouteComponentProps } from 'react-router'
import {
    GetGroupCalendarResponse,
    MyDate,
    Time,
    SocketENUM,
} from '../api/models'
import Calendar from './Calendar'
import AddUserModal from './AddUserModal'
import SpinningModal from './SpinningModal'
import SendLinkModal from './SendLinkModal'

enum LoginStatus {
    LOGGED_IN = 'logged_in',
    NOT_LOGGED_IN = 'not_logged_in',
    PENDING = 'pending',
}

type GroupState = {
    status: LoginStatus
    shouldShowLink: boolean
} & GetGroupCalendarResponse

const dayInOneWeek = new Date()
dayInOneWeek.setDate(dayInOneWeek.getDate() + 7)

const emptyGroupState: GetGroupCalendarResponse = {
    events: [],
    secondary: [],
    group: {
        meeting_length: new Time('01:00'),
        name: 'Empty',
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
            status: LoginStatus.PENDING,
            shouldShowLink: false,
        }
    }

    componentDidMount() {
        if (this.props.location.state) {
            //This is only true when redirected from /creategroup
            this.setState({ shouldShowLink: true })
        }
        api.setReceiveCallback(this.handleSocketIO)
        this.handleSocketIO(SocketENUM.JOIN)
    }

    handleSocketIO = (message: SocketENUM) => {
        switch (message) {
            case SocketENUM.JOIN:
            case SocketENUM.LEAVE:
            case SocketENUM.UPDATE:
                const group_str_id = this.props.match.params.group_str_id
                const loggedIn = api.isLoggedIn(group_str_id)
                if (!loggedIn.success) {
                    this.setState({ status: LoginStatus.NOT_LOGGED_IN })
                } else {
                    const google_id = loggedIn.google_id
                    this.getCalendarData(group_str_id, google_id)
                }
                break
            case SocketENUM.DELETE:
                // TODO: deleted group
                console.log('GROUP IS DELETED SHOW SOMETHING NICE')
                break
        }
    }

    getCalendarData = (group_str_id: string, google_id: string) => {
        this.setState({ status: LoginStatus.PENDING })
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
            .catch((error: any) => {
                // TODO: Error handeling
                console.log('Error')
                console.log(error)
            })
    }

    closeSendLinkModal = () => {
        this.setState({ shouldShowLink: false })
    }

    render() {
        return (
            <div className="relative overflow-hidden">
                <div
                    className={
                        'flex' +
                        ' ' +
                        (this.state.status === LoginStatus.NOT_LOGGED_IN ||
                        this.state.status === LoginStatus.PENDING ||
                        this.state.shouldShowLink
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
                                secondary={this.state.secondary}
                            />
                        </div>
                        <div className="h-8 " />
                    </div>
                </div>
                {this.state.status === LoginStatus.PENDING && <SpinningModal />}
                {this.state.status === LoginStatus.NOT_LOGGED_IN && (
                    <AddUserModal
                        group_str_id={this.props.match.params.group_str_id}
                        getCalendarData={this.getCalendarData}
                    />
                )}
                {this.state.shouldShowLink &&
                    this.state.status !== LoginStatus.PENDING && (
                        <SendLinkModal
                            closeSendLinkModal={() => this.closeSendLinkModal()}
                        />
                    )}
            </div>
        )
    }
}

export default Group
