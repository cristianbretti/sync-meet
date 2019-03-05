import React, { useState } from 'react';
import logo from '../logo.svg';
import '../App.css';
import GoogleLogin from 'react-google-login';

export const OwnerStart = () => {
    const [googleAccessToken, setGoogleAccessToken] = useState("")

    const responseGoogle = (response: any) => {
        let token: string = response.Zi.access_token;
        console.log(token);
        setGoogleAccessToken(token)
    }

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

      </div>
    );
}