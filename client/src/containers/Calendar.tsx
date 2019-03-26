import React, { Component } from 'react';
import Sidebar from './Sidebar';
import Day from './Day';
import Timebar from './Timebar';
import api from '../api/api';
import { RouteComponentProps } from 'react-router';
import { GetGroupCalendarResponse, GetGroupCalendarResponseSuccess } from '../api/models';



export interface GroupInfo {
  group: GetGroupCalendarResponseSuccess["group"]
  events: GetGroupCalendarResponseSuccess["events"]
  owner: GetGroupCalendarResponseSuccess["owner"]
  users: GetGroupCalendarResponseSuccess["users"]
  you: GetGroupCalendarResponseSuccess["you"]

}

type CalendarState = GroupInfo | {};


class Calendar extends Component<RouteComponentProps<any>, CalendarState> {
  constructor(props: RouteComponentProps<any>) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  componentDidMount() {
    const group_str_id = this.props.match.params.group_str_id;
    const loggedIn = api.isLoggedIn(group_str_id);
    if (!loggedIn.success) {
      // TODO: ADD USER and stuff
      return;
    }
    const google_id = loggedIn.google_id;
    api.getGroupCalendar(google_id, group_str_id)
    .then((getGroupCalendarResponse: GetGroupCalendarResponse) => {
      if (!getGroupCalendarResponse.success) {
        // TODO: something wrong
        console.log("Access token expired!!")
        console.log(getGroupCalendarResponse)
        return;
      }
      this.setState({
        group: getGroupCalendarResponse.group,
        events: getGroupCalendarResponse.events,
        owner: getGroupCalendarResponse.owner,
        users: getGroupCalendarResponse.users,
        you: getGroupCalendarResponse.you

      })
    })
    .catch((error: any)=>{
      console.log("Error")
      console.log(error)
      // TODO 
    })

  }
  
  render() {
    if(Object.entries(this.state).length === 0 && this.state.constructor === Object){
      return(
      <div>
        SPINNING
      </div>
      )
    }
    const tempState = this.state as GroupInfo;
    console.log(tempState)
    return (
      <div>
        <div className="flex">
          <div className="w-1/5 h-screen border border-black">
            <Sidebar {... tempState}></Sidebar>
          </div>  
          
          <div className="w-4/5 h-screen">  {/* The calendar goes in here */}
            <div className="flex">

              <div className="w-1/40 h-screen border-t border-black"> {/* The timebar component goes in here */}
                <Timebar></Timebar>
              
              </div> 

              <div className="w-39/40 overflow-x-auto flex flex-no-wrap">
              
                <div className="w-1/7 flex-none border border-black">
                  <Day></Day> {/* One day takes up one seventh of the space*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;