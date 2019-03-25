import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import TextInput from '../components/TextInput';
import api from '../api/api';
import {ErrorResponse, CreateGroupBody, Time, MyDate, CreateGroupResponse} from '../api/models';
import Logo from '../components/logo/Logo';
import { RouteComponentProps } from 'react-router-dom';
import HelpHover from '../components/HelpHover';
import DateInput from '../components/DateInput';
import TimeInput from '../components/time_input/TimeInput';


const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const CreateGroup: React.FC<RouteComponentProps<any>> = ({history}) => {
    const [formValues, setFormValues] = useState({
        userName: "",
        groupName: "",
        fromDate: new MyDate({date: new Date()}),
        toDate: new MyDate({date: nextWeek}),
        fromTime: new Time("08:00"),
        toTime: new Time("17:00"),
        meetingLength: new Time("01:00"),
    });
    const [formChanged, setFormChanged] = useState({
        userName: false,
        groupName: false,
        fromDate: false,
        toDate: false,
        fromTime: false,
        toTime: false,
        meetingLength: false,
    })

    const handleChange = (name: string, value: string | MyDate | Time) => {
        setFormValues(values => ({ ...values, [name]: value }));
        setFormChanged({...formChanged, [name]:true});
    };


    const responseGoogle = (googleResponse: any) => {
        console.log(googleResponse);
        let newGroup: CreateGroupBody = {
            group_name: formValues.groupName,
            from_date: formValues.fromDate,
            to_date: formValues.toDate,
            from_time: formValues.fromTime,
            to_time: formValues.toTime,
            meeting_length: formValues.meetingLength,
            user_name: formValues.userName,
            access_token: googleResponse.getAuthResponse().access_token,
            id_token: googleResponse.getAuthResponse().id_token
        }
        api.createGroup(newGroup)
        .then((createGroupResponse: CreateGroupResponse) => {
            localStorage.setItem("google_id", createGroupResponse.google_id)
            history.push("/group/" + createGroupResponse.group_str_id)
        })
        .catch((error: ErrorResponse) => {
            console.error(error)
        })
    }

    const onGoogleFailure = (error:any) => {
        console.log(error)
    }

    const validDates = formValues.toDate.date >= formValues.fromDate.date && formChanged.fromDate && formChanged.toDate;
    const validTimes = formValues.toTime.time > formValues.fromTime.time && formChanged.fromTime && formChanged.toTime;;
    const validMeetingLength = formValues.meetingLength > new Time("0000") && formChanged.meetingLength;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <form autoComplete="off" className="flex flex-col justify-center items-center bg-grey-darker shadow-inner">
                <h2 className="text-blue-dark w-full bg-grey-darkest pr-32 pb-2">Creating a new meeting</h2>
                <div className="flex items-center pt-4">
                    <TextInput 
                        className="mr-4 mb-2 mt-4"
                        label="Your display name" 
                        name={"userName"} 
                        value={formValues.userName} 
                        changed={formChanged.userName}
                        onChange={handleChange}
                        valid={formValues.userName !== "" && formChanged.userName}
                    />
                    <HelpHover className="pl-4 pt-4" text="This is the name that you will be represented with to your colleagues." />
                </div>
                <div className="flex items-center justify-around">
                    <TextInput 
                        className="mr-4 my-2"
                        label="Meeting title" 
                        name={"groupName"} 
                        value={formValues.groupName} 
                        changed={formChanged.groupName}
                        onChange={handleChange}
                        valid={formValues.groupName !== "" && formChanged.groupName}
                    />
                    <HelpHover className="pl-4 pt-4" text="This is the name this meeting will be represented with." />
                </div>
                <div className="flex items-center">
                    <DateInput
                        className="mr-4 my-2"
                        label="From date"
                        name={"fromDate"}
                        value={formValues.fromDate}
                        selectsStart={true}
                        selectsEnd={false}
                        startDate={formValues.fromDate}
                        endDate={formValues.toDate}
                        onChange={handleChange}
                        valid={validDates || !formChanged.toDate}
                        changed={formChanged.fromDate}
                    />
                    <HelpHover className="pl-4 pt-4" text="Look for available time slots from this day and forward." />
                </div>
                <div className="flex items-center">
                    <DateInput
                        className="mr-4 my-2"
                        label="To date"
                        name={"toDate"}
                        value={formValues.toDate}
                        selectsStart={false}
                        selectsEnd={true}
                        startDate={formValues.fromDate}
                        endDate={formValues.toDate}
                        onChange={handleChange}
                        valid={validDates || !formChanged.fromDate}
                        changed={formChanged.toDate}
                    />
                    <HelpHover className="pl-4 pt-4" text="Look for available time slots up to this day. This day is included as the last day." />
                </div>
                <div className="flex items-center">
                    <TimeInput
                        className="mr-4 my-2"
                        label="From time"
                        name={"fromTime"}
                        value={formValues.fromTime}
                        onChange={handleChange}
                        valid={validTimes || !formChanged.toTime}
                        changed={formChanged.fromTime}
                        
                    />
                    <HelpHover className="pl-4 pt-4" text="From which time on the day to look for available time slots." />
                </div>
                <div className="flex items-center">
                    <TimeInput
                        className="mr-4 my-2"
                        label="To time"
                        name={"toTime"}
                        value={formValues.toTime}
                        onChange={handleChange}
                        valid={validTimes || !formChanged.fromTime}
                        changed={formChanged.toTime}
                    />
                    <HelpHover className="pl-4 pt-4" text="From which time on the day to look for available time slots." />
                </div>
                <div className="flex items-center">
                    <TimeInput
                        className="mr-4 my-2"
                        label="Meeting length"
                        name={"meetingLength"}
                        value={formValues.meetingLength}
                        onChange={handleChange}
                        valid={validMeetingLength}
                        changed={formChanged.meetingLength}
                    />
                    <HelpHover className="pl-4 pt-4" text="The expected duration of the meeting." />
                </div>
                <div className="w-full flex justify-center">
                    <GoogleLogin
                        className="mt-12 mb-6 w-2/3 google-button"
                        clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                        buttonText="Grant access to calendar and create new meeting"
                        onSuccess={responseGoogle }
                        onFailure={onGoogleFailure}
                        cookiePolicy={'single_host_origin'}
                        scope={'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'}
                        disabled={!(validDates && validMeetingLength && validTimes && formValues.userName !== "" && formValues.groupName !== "")}
                    />
                </div>
            </form>
            <Logo className="w-16 fixed pin-t pin-l m-6"/>
        </div>
    );
}
export default CreateGroup;