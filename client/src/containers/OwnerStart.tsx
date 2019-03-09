import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import GoogleLogin from 'react-google-login';
import api from '../api/api';

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

    const responseGoogle = (response: any) => {
        console.log(response);
        let data = {
            group_name:"test_group",
            from_date:"2019-03-20",
            to_date:"2020-01-20",
            from_time:"10:00",
            to_time:"10:01",
            meeting_length:"01:00",
            user_name:"test_user",
            access_token: response.getAuthResponse().access_token,
            id_token: response.getAuthResponse().id_token
        }
        
        api.request('creategroup', "POST", data, response => {
            console.log(response);
            api.join(response.group_str_id);
        },
        error => {
            console.log(error)
        })
    }

export default OwnerStart;
