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

registerLocale('sv', sv);
setDefaultLocale('sv');

const CreateGroup: React.SFC<RouteComponentProps<any>> = ({history}) => {
    const [formValues, setFormValues] = useState({
        userName: "",
        groupName: "",
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        lengthHours: 0,
        lengthMinutes: 0,
    });

    const handleChange = (name: string, value: string) => {
        setFormValues(values => ({ ...values, [name]: value }));
    };


    const responseGoogle = (googleResponse: any) => {
        console.log(googleResponse);
        let newGroup: CreateGroupBody = {
            group_name: formValues.groupName,
            from_date: new MyDate(DateToYYYYMMDD(formValues.startDate)),
            to_date: new MyDate(DateToYYYYMMDD(formValues.endDate)),
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
                <h2 className="text-blue-dark w-full bg-grey-darkest pr-12 pb-2">Creating a new meeting</h2>
                <div className="flex items-center">
                    <TextInput 
                        className="mr-4 mb-2 mt-4"
                        label="Your display name" 
                        name={"userName"} 
                        value={formValues.userName} 
                        onChange={handleChange}
                    />
                    <HelpHover className="pt-2" text="This is the name that you will be represented with to your colleagues." />
                </div>
                <div className="flex items-center">
                    <TextInput 
                        className="mr-4 my-2"
                        label="Meeting title" 
                        name={"groupName"} 
                        value={formValues.groupName} 
                        onChange={handleChange}
                    />
                    <HelpHover className="pt-2" text="This is the name this meeting will be represented with." />
                </div>
                <div>Enter start date"</div>
                <DatePicker
                    className="p-2"
                    selected={formValues.startDate}
                    selectsStart
                    startDate={formValues.startDate}
                    endDate={formValues.endDate}
                    dateFormat="yyyy/MM/dd"
                    onChange={(date: Date) => setFormValues({...formValues, ["startDate"]:date})}
                    />
                <div> text="Enter end date"/></div>
                <DatePicker
                    className="p-2"
                    selected={formValues.endDate}
                    selectsStart
                    startDate={formValues.startDate}
                    endDate={formValues.endDate}
                    dateFormat="yyyy/MM/dd"
                    onChange={(date: Date) => setFormValues({...formValues, ["endDate"]:date})}
                />
                <div> text="Enter start time"/></div>
                <DatePicker
                    className="p-2"
                    selected={formValues.startTime}
                    onChange={(date: Date) => setFormValues({...formValues, ["startTime"]:date})}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    dateFormat="HH:mm"
                    timeCaption="Time"
                />
                <div> text="Enter end time"/></div>
                <DatePicker
                    className="p-2"
                    selected={formValues.endTime}
                    onChange={(date: Date) => setFormValues({...formValues, ["endTime"]:date})}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    dateFormat="HH:mm"
                    timeCaption="Time"
                />
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