import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import TextInput from '../components/TextInput';
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import sv from 'date-fns/locale/sv';
import "react-datepicker/dist/react-datepicker.css";
import api from '../api/api';
import {ErrorResponse, CreateGroupBody, Time, MyDate, CreateGroupResponse, GetGroupCalendarResponse, EmptyResponse} from '../api/models';
import Logo from '../components/logo/Logo';
import {DateToYYYYMMDD, DateToHHMM, HourAndMinuteToHHMM} from '../utils/helpers'
import { RouteComponentProps } from 'react-router-dom';
import HelpHover from '../components/HelpHover';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';

registerLocale('sv', sv);
setDefaultLocale('sv');
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const CreateGroup: React.SFC<RouteComponentProps<any>> = ({history}) => {
    const [formValues, setFormValues] = useState({
        userName: "",
        groupName: "",
        startDate: new MyDate({date: new Date()}),
        endDate: new MyDate({date: nextWeek}),
        startTime: new Date(),
        endTime: new Date(),
        lengthHours: 1,
        lengthMinutes: 0,
    });
    const [dateChanged, setDateChanged] = useState(false);

    const handleChange = (name: string, value: string | Date) => {
        setFormValues(values => ({ ...values, [name]: value }));
    };


    const responseGoogle = (googleResponse: any) => {
        console.log(googleResponse);
        let newGroup: CreateGroupBody = {
            group_name: formValues.groupName,
            from_date: formValues.startDate,
            to_date: formValues.endDate,
            from_time: new Time(DateToHHMM(formValues.startTime)),
            to_time: new Time(DateToHHMM(formValues.endTime)),
            meeting_length: new Time(HourAndMinuteToHHMM(formValues.lengthHours, formValues.lengthMinutes)),
            user_name: formValues.userName,
            access_token: googleResponse.getAuthResponse().access_token,
            id_token: googleResponse.getAuthResponse().id_token
        }
        api.createGroup(newGroup)
        .then((createGroupResponse: CreateGroupResponse) => {
            console.log(createGroupResponse)
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

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col justify-center items-center bg-grey-darker">
                <h2 className="text-blue-dark w-full bg-grey-darkest pr-16 pb-2">Creating a new meeting</h2>
                <div className="flex items-center">
                    <TextInput 
                        className="mr-4 mb-2 mt-4"
                        label="Your display name" 
                        name={"userName"} 
                        value={formValues.userName} 
                        onChange={handleChange}
                    />
                    <HelpHover className="pl-4 pt-2" text="This is the name that you will be represented with to your colleagues." />
                </div>
                <div className="flex items-center">
                    <TextInput 
                        className="mr-4 my-2"
                        label="Meeting title" 
                        name={"groupName"} 
                        value={formValues.groupName} 
                        onChange={handleChange}
                    />
                    <HelpHover className="pl-4 pt-2" text="This is the name this meeting will be represented with." />
                </div>
                <div className="flex items-center">
                    <DateInput
                        className="mr-4 my-2"
                        label="From date"
                        name={"startDate"}
                        value={formValues.startDate.date}
                        selectsStart={true}
                        selectsEnd={false}
                        startDate={formValues.startDate}
                        endDate={formValues.endDate}
                        onChange={(name,value) => {setDateChanged(true); handleChange(name, value);}}
                        valid={formValues.endDate >= formValues.startDate}
                        changed={dateChanged}
                    />
                    <HelpHover className="pl-4 pt-2" text="Look for available time slots from this day and forward." />
                </div>
                <div className="flex items-center">
                    <DateInput
                        className="mr-4 my-2"
                        label="To date"
                        name={"endDate"}
                        value={formValues.endDate.date}
                        selectsStart={false}
                        selectsEnd={true}
                        startDate={formValues.startDate}
                        endDate={formValues.endDate}
                        onChange={(name,value) => {setDateChanged(true); handleChange(name, value);}}
                        valid={formValues.endDate >= formValues.startDate}
                        changed={dateChanged}
                    />
                    <HelpHover className="pl-4 pt-2" text="Look for available time slots up to this day. This day is included as the last day." />
                </div>
                <div className="flex items-center">
                    <TimeInput
                        className="mr-4 my-2"
                        label="From time"
                        name={"startTime"}
                        value={formValues.startTime}
                        onChange={handleChange}
                    />
                    <HelpHover className="pl-4 pt-2" text="From which time on the day to look for available time slots." />
                </div>
                <div className="flex items-center">
                    <TimeInput
                        className="mr-4 my-2"
                        label="To time"
                        name={"endTime"}
                        value={formValues.endTime}
                        onChange={handleChange}
                    />
                    <HelpHover className="pl-4 pt-2" text="From which time on the day to look for available time slots." />
                </div>
                <div> text="Length" /></div>
                <div className="p-2 flex flex-row items-center">
                    <input
                        className="m-2 p-2 w-12"
                        type="number"
                        name="lengthHours"
                        value={formValues.lengthHours}
                        onChange={(event) => handleChange(event.target.name, event.target.value)}
                    />
                    <div className="text-white align-middle">H</div>
                
                    <input
                        className="m-2 p-2 w-12"
                        type="number"
                        name="lengthMinutes"
                        value={formValues.lengthMinutes}
                        onChange={(event) => handleChange(event.target.name, event.target.value)}
                    />
                    <div className="text-white align-middle">M</div>
                </div>
                <GoogleLogin
                    className="m-2"
                    clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                    buttonText="Give access and create event"
                    onSuccess={responseGoogle }
                    onFailure={onGoogleFailure}
                    cookiePolicy={'single_host_origin'}
                    scope={'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'}/>
            </div>
            <Logo className="w-16 fixed pin-t pin-l m-6"/>
        </div>
    );
}
export default CreateGroup;