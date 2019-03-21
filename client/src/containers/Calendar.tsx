import React, { Component } from 'react';
import Sidebar from './Sidebar';
import Day from './Day';
import Timebar from './Timebar';
import api from '../api/api';
import { RouteComponentProps } from 'react-router';
import { GetGroupCalendarResponse, EmptyResponse } from '../api/models';



export interface GroupInfo {
  group: GetGroupCalendarResponse["group"]
  events: GetGroupCalendarResponse["events"]
  owner: GetGroupCalendarResponse["owner"]
  users: GetGroupCalendarResponse["users"]
  you: GetGroupCalendarResponse["you"]

}

type CalendarState = GroupInfo | EmptyResponse


class Calendar extends Component<RouteComponentProps<any>, CalendarState> {
  constructor(props: RouteComponentProps<any>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const google_id = localStorage.getItem('google_id');
    if(google_id === null){
      // TODO
      console.log("ERROR")
      return;
    }
    const group_str_id = this.props.match.params.group_str_id;
    console.log(google_id)
    console.log(group_str_id)
    api.getGroupCalendar(google_id, group_str_id)
    .then((getGroupCalendarResponse: GetGroupCalendarResponse) => {
      this.setState({
        group: getGroupCalendarResponse.group,
        events: getGroupCalendarResponse.events,
        owner: getGroupCalendarResponse.owner,
        users: getGroupCalendarResponse.users,
        you: getGroupCalendarResponse.you

      })
      console.log(getGroupCalendarResponse);
      // api.remove(true, createGroupResponse.google_id, createGroupResponse.group_str_id)
      // .then((removeResponse: EmptyResponse) => {
      //     console.log(removeResponse);
      // })
    })
    .catch((error: any)=>{
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
            <Sidebar {...{group: tempState.group, events: tempState.events, owner: tempState.owner, users: tempState.users, you: tempState.you}}></Sidebar>
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