import React, { useState } from 'react';
import logo from '../logo.svg';
import '../App.css';
import GoogleLogin from 'react-google-login';
import {InputLabel} from '../components';

export const OwnerStart = () => {
    const [googleAccessToken, setGoogleAccessToken] = useState("")
    const [formValues, setFormValues] = useState({
        eventName: "",
        eventStartDate: "",
        eventEndDate: "",
    });

    const responseGoogle = (response: any) => {
        let token: string = response.Zi.access_token;
        console.log(token);
        setGoogleAccessToken(token)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log("PRESS")
        if (event) event.preventDefault();
        console.log(formValues)
      };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setFormValues(values => ({ ...values, [event.target.name]: event.target.value }));
      };

    return (
    <div className="text-center min-h-screen flex flex-col items-center justify-center bg-blue">
        <div className="p-5 text-white uppercase text-2xl">
            Welcome to Sync Meet!
        </div>
        <GoogleLogin
            clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
            buttonText="Give access to Google Calendar"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            scope={'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'}/>
        <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
            <InputLabel text="Enter event name"/>
            <input className="p-2" type="text" name="eventName" value={formValues.eventName} onChange={handleChange}/>
            <InputLabel text="Enter start date"/>
            <input className="p-2" type="text" name="eventDate" value={formValues.eventStartDate} onChange={handleChange}/>
            <InputLabel text="Enter end date"/>
            <input className="p-2" type="text" name="eventDate" value={formValues.eventEndDate} onChange={handleChange}/>
            <button className="bg-white p-2 m-5" type="submit">Create Event</button>
        </form>
      </div>
    );
}