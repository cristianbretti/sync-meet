import React, { Component } from 'react'
import Sidebar from './Sidebar'
import Timebar from './Timebar'
import api from '../api/api'
import { RouteComponentProps } from 'react-router'
import { GetGroupCalendarResponse, GroupInfo } from '../api/models'
import Calendar from './Calendar'

type GroupState = GroupInfo | {}

class Group extends Component<RouteComponentProps<any>, GroupState> {
    constructor(props: RouteComponentProps<any>) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        const group_str_id = this.props.match.params.group_str_id
        const loggedIn = api.isLoggedIn(group_str_id)
        if (!loggedIn.success) {
            // TODO: ADD USER and stuff
            return
        }
        const google_id = loggedIn.google_id
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
                })
            })
            .catch((error: any) => {
                console.log('Error')
                console.log(error)
                // TODO
            })
    }

    render() {
        if (
            Object.entries(this.state).length === 0 &&
            this.state.constructor === Object
        ) {
            return <div>SPINNING</div>
        }
        const tempState = this.state as GroupInfo
        return (
            <div>
                <div className="flex">
                    <div className="flex-1 h-screen border border-black">
                        <Sidebar {...tempState} />
                    </div>

                    <div className="flex-3 flex h-screen">
                        <Timebar events={tempState.events} />
                        <Calendar events={tempState.events} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Group
