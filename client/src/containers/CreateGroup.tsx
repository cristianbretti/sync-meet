import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import {InputLabel} from '../components';
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import sv from 'date-fns/locale/sv';
import "react-datepicker/dist/react-datepicker.css";
import api from '../api/api';
import {ErrorResponse, CreateGroupBody, Time, MyDate, CreateGroupResponse, GetGroupCalendarResponse, EmptyResponse} from '../api/models';
import AnimLogo from '../components/logo/AnimLogo';
import Logo from '../components/logo/Logo';
import {DateToYYYYMMDD, DateToHHMM, HourAndMinuteToHHMM} from '../utils/helpers'
import { RouteComponentProps } from 'react-router-dom';

registerLocale('sv', sv);
setDefaultLocale('sv');

export const CreateGroup: React.SFC<RouteComponentProps<any>> = ({history}) => {
    const [formValues, setFormValues] = useState({
        name: "",
        eventName: "",
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        lengthHours: 0,
        lengthMinutes: 0,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setFormValues(values => ({ ...values, [event.target.name]: event.target.value }));
    };


    const responseGoogle = (googleResponse: any) => {
        console.log(googleResponse);
        let data: CreateGroupBody = {
            group_name: formValues.eventName,
            from_date: new MyDate(DateToYYYYMMDD(formValues.startDate)),
            to_date: new MyDate(DateToYYYYMMDD(formValues.endDate)),
            from_time: new Time(DateToHHMM(formValues.startTime)),
            to_time: new Time(DateToHHMM(formValues.endTime)),
            meeting_length: new Time(HourAndMinuteToHHMM(formValues.lengthHours, formValues.lengthMinutes)),
            user_name: formValues.name,
            access_token: googleResponse.getAuthResponse().access_token,
            id_token: googleResponse.getAuthResponse().id_token
        }
        api.createGroup(data)
        .then((createGroupResponse: CreateGroupResponse) => {
            console.log(createGroupResponse)
            localStorage.setItem("google_id", createGroupResponse.google_id)
            history.push("/group/" + createGroupResponse.group_str_id)

        

            // api.getGroupCalendar(createGroupResponse.google_id, createGroupResponse.group_str_id)
            // .then((getGroupCalendarResponse: GetGroupCalendarResponse) => {
            //     console.log(getGroupCalendarResponse);
            //     api.remove(true, createGroupResponse.google_id, createGroupResponse.group_str_id)
            //     .then((removeResponse: EmptyResponse) => {
            //         console.log(removeResponse);
            //     })
            // })
        })
        .catch((error: ErrorResponse) => {
            console.error(error)
        })
    }

    const onGoogleFailure = (error:any) => {
        console.log(error)
    }

    return (
        <div className="text-center min-h-screen flex flex-col items-center justify-center bg-blue">
            <AnimLogo />
            <div className="m-8 flex flex-col justify-center items-center">
                <InputLabel text="Enter name"/>
                <input className="p-2" type="text" name="name" value={formValues.name} onChange={handleChange}/>
                <InputLabel text="Enter event name"/>
                <input className="p-2" type="text" name="eventName" value={formValues.eventName} onChange={handleChange}/>
                <InputLabel text="Enter start date"/>
                <DatePicker
                    className="p-2"
                    selected={formValues.startDate}
                    selectsStart
                    startDate={formValues.startDate}
                    endDate={formValues.endDate}
                    dateFormat="yyyy/MM/dd"
                    onChange={(date: Date) => setFormValues({...formValues, ["startDate"]:date})}
                    />
                <InputLabel text="Enter end date"/>
                <DatePicker
                    className="p-2"
                    selected={formValues.endDate}
                    selectsStart
                    startDate={formValues.startDate}
                    endDate={formValues.endDate}
                    dateFormat="yyyy/MM/dd"
                    onChange={(date: Date) => setFormValues({...formValues, ["endDate"]:date})}
                />
                <InputLabel text="Enter start time"/>
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
                <InputLabel text="Enter end time"/>
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
                <InputLabel text="Length" />
                <div className="p-2 flex flex-row items-center">
                    <input
                        className="m-2 p-2 w-12"
                        type="number"
                        name="lengthHours"
                        value={formValues.lengthHours}
                        onChange={handleChange}/>
                    <div className="text-white align-middle">H</div>
                
                    <input
                        className="m-2 p-2 w-12"
                        type="number"
                        name="lengthMinutes"
                        value={formValues.lengthMinutes}
                        onChange={handleChange}/>
                    <div className="text-white align-middle">M</div>
                </div>
                <GoogleLogin
                    clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                    buttonText="Give access and create event"
                    onSuccess={responseGoogle }
                    onFailure={onGoogleFailure}
                    cookiePolicy={'single_host_origin'}
                    scope={'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'}/>
            </div>
            <Logo className="w-16"/>
        </div>
    );
}