import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import GoogleLogin from 'react-google-login';
import api from '../api/api';
import {ErrorResponse, CreateGroupBody, Time, MyDate, CreateGroupResponse, GetGroupCalendarResponse, EmptyResponse} from '../api/models';

class OwnerStart extends Component {
    render() {
        return (
        <div className="text-center">
            <header className="App-header bg-blue">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Edit <code>src/App.tsx</code> and save to relod
            </p>
            <GoogleLogin
                clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                scope={'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'}
            />
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn React
            </a>
            </header>
        </div>
        );
    }
    }

    const responseGoogle = (googleResponse: any) => {
        console.log(googleResponse);
        let data: CreateGroupBody = {
            group_name:"test_group",
            from_date: new MyDate("2019-03-20"),
            to_date: new MyDate("2019-03-24"),
            from_time: new Time("08:00"),
            to_time: new Time("18:01"),
            meeting_length: new Time("01:00"),
            user_name:"test_user",
            access_token: googleResponse.getAuthResponse().access_token,
            id_token: googleResponse.getAuthResponse().id_token
        }
        api.createGroup(data)
        .then((createGroupResponse: CreateGroupResponse) => {
            console.log(createGroupResponse)
            api.getGroupCalendar(createGroupResponse.google_id, createGroupResponse.group_str_id)
            .then((getGroupCalendarResponse: GetGroupCalendarResponse) => {
                console.log(getGroupCalendarResponse);
                api.remove(true, createGroupResponse.google_id, createGroupResponse.group_str_id)
                .then((removeResponse: EmptyResponse) => {
                    console.log(removeResponse);
                })
            })
        })
        .catch((error: ErrorResponse) => {
            console.error(error)
        })
    }

export default OwnerStart;
