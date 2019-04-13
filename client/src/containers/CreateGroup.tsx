import React, { useState } from 'react'
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login'
import TextInput from '../components/TextInput'
import api from '../api/api'
import {
    ErrorResponse,
    CreateGroupBody,
    Time,
    MyDate,
    CreateGroupResponse,
} from '../api/models'
import Logo from '../components/logo/Logo'
import { RouteComponentProps } from 'react-router-dom'
import HelpHover from '../components/HelpHover'
import DateInput from '../components/DateInput'
import TimeInput from '../components/time_input/TimeInput'

const nextWeek = new Date()
nextWeek.setDate(nextWeek.getDate() + 7)

const CreateGroup: React.FC<RouteComponentProps<any>> = ({ history }) => {
    const [formValues, setFormValues] = useState({
        userName: '',
        groupName: '',
        fromDate: new MyDate({ date: new Date() }),
        toDate: new MyDate({ date: nextWeek }),
        fromTime: new Time('08:00'),
        toTime: new Time('17:00'),
        meetingLength: new Time('01:00'),
    })
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
        setFormValues(values => ({ ...values, [name]: value }))
        setFormChanged({ ...formChanged, [name]: true })
    }

    const responseGoogle = (googleResponse: any) => {
        console.log(googleResponse)
        let newGroup: CreateGroupBody = {
            group_name: formValues.groupName,
            from_date: formValues.fromDate,
            to_date: formValues.toDate,
            from_time: formValues.fromTime,
            to_time: formValues.toTime,
            meeting_length: formValues.meetingLength,
            user_name: formValues.userName,
            access_token: googleResponse.getAuthResponse().access_token,
            id_token: googleResponse.getAuthResponse().id_token,
        }
        api.createGroup(newGroup)
            .then((createGroupResponse: CreateGroupResponse) => {
                api.login(
                    createGroupResponse.group_str_id,
                    createGroupResponse.google_id,
                    formValues.toDate
                )
                history.push('/group/' + createGroupResponse.group_str_id, true)
            })
            .catch((error: ErrorResponse) => {
                history.push({
                    pathname: '/error',
                    state: {
                      errorMessage: error.error,
                    }
                  })
                console.error(error)
            })
    }

    const onGoogleFailure = (error: any) => {
        history.push({
            pathname: '/error',
            state: {
              errorMessage: error.error || "",
            }
          })
        console.log('BAD google reponse from create group')
        console.log(error)
    }

    const rowWrapper = (
        firstChild: JSX.Element,
        secondChild: JSX.Element | JSX.Element[],
        classNameFirst?: string,
        calssNameSecond?: string
    ) => (
        <div className="flex-1 flex">
            <div className="flex-1 flex flex-col items-end bg-white text-grey-darkest pr-4">
                <div className={'flex-1 flex items-center ' + classNameFirst}>
                    {firstChild}
                </div>
            </div>
            <div className={'flex-3 pl-4 flex items-center ' + calssNameSecond}>
                {secondChild}
            </div>
        </div>
    )

    const timeInMin = (t: Time) => t.getHours() * 60 + t.getMinutes()

    const validDates =
        formValues.toDate.date >= formValues.fromDate.date &&
        formChanged.fromDate &&
        formChanged.toDate
    const validTimes =
        formValues.toTime.time > formValues.fromTime.time &&
        formChanged.fromTime &&
        formChanged.toTime
    const validMeetingLength =
        formValues.meetingLength > new Time('0000') &&
        formChanged.meetingLength &&
        timeInMin(formValues.meetingLength) <=
            timeInMin(formValues.toTime) - timeInMin(formValues.fromTime)
    const validUserName = formValues.userName !== ''
    const validMeetingName = formValues.groupName !== ''
    const allValid =
        validDates &&
        validMeetingLength &&
        validTimes &&
        validUserName &&
        validMeetingName
    return (
        <div className="min-h-screen flex flex-col overflow-hidden bg-white">
            <form
                autoComplete="off"
                className="flex-1 flex flex-col bg-grey-darkest text-white shadow-inner overflow-hidden"
            >
                <div className="flex-1 flex">
                    <div className="flex-1 flex flex-col items-end justify-center bg-white text-grey-darkest pr-4">
                        <div className="flex flex-col items-end justify-center overflow-hidden font-bold text-lg md:text-3xl">
                            <div>CREATING</div>
                            <div className="text-green-dark font-medium">
                                NEW
                            </div>
                            <div className="">MEETING</div>
                        </div>
                    </div>
                    <div className="flex-3 pl-4 flex items-center">
                        <TextInput
                            className=""
                            label="Meeting title"
                            name={'groupName'}
                            value={formValues.groupName}
                            changed={formChanged.groupName}
                            onChange={handleChange}
                            valid={
                                formValues.groupName !== '' &&
                                formChanged.groupName
                            }
                        />
                        <HelpHover
                            className="pl-4 pt-1"
                            text="This is the name this meeting will be represented with."
                        />
                    </div>
                </div>
                {rowWrapper(
                    <i
                        className={
                            'text-4xl material-icons pt-2 ' +
                            ' ' +
                            (validUserName ? 'text-green-dark' : '')
                        }
                    >
                        perm_identity
                    </i>,
                    [
                        <TextInput
                            className=""
                            label="Your display name"
                            name={'userName'}
                            key={'userName'}
                            value={formValues.userName}
                            changed={formChanged.userName}
                            onChange={handleChange}
                            valid={
                                formValues.userName !== '' &&
                                formChanged.userName
                            }
                        />,
                        <HelpHover
                            className="pl-4 pt-1"
                            key="help"
                            text="This is the name that you will be represented with to your colleagues."
                        />,
                    ]
                )}
                {rowWrapper(
                    <i
                        className={
                            'text-3xl material-icons pt-2' +
                            ' ' +
                            (validDates ? 'text-green-dark' : '')
                        }
                    >
                        calendar_today
                    </i>,
                    [
                        <DateInput
                            className=""
                            label="From date"
                            name={'fromDate'}
                            key={'fromDate'}
                            value={formValues.fromDate}
                            selectsStart={true}
                            selectsEnd={false}
                            startDate={formValues.fromDate}
                            endDate={formValues.toDate}
                            onChange={handleChange}
                            valid={validDates || !formChanged.toDate}
                            changed={formChanged.fromDate}
                        />,
                        <i key="arrow" className="material-icons pt-2 px-4">
                            arrow_forward
                        </i>,
                        <DateInput
                            className=""
                            label="To date"
                            name={'toDate'}
                            key={'toDate'}
                            value={formValues.toDate}
                            selectsStart={false}
                            selectsEnd={true}
                            startDate={formValues.fromDate}
                            endDate={formValues.toDate}
                            onChange={handleChange}
                            valid={validDates || !formChanged.fromDate}
                            changed={formChanged.toDate}
                        />,
                        <HelpHover
                            className="pl-4 pt-1"
                            key="help"
                            text="Look for available time slots for a meeting between (and including) these two dates."
                        />,
                    ],
                    '',
                    'flex-wrap'
                )}
                {rowWrapper(
                    <i
                        className={
                            'text-3xl material-icons pt-2' +
                            ' ' +
                            (validTimes ? 'text-green-dark' : '')
                        }
                    >
                        access_time
                    </i>,
                    [
                        <TimeInput
                            className=""
                            label="From time"
                            name={'fromTime'}
                            key={'fromTime'}
                            value={formValues.fromTime}
                            onChange={handleChange}
                            valid={validTimes || !formChanged.toTime}
                            changed={formChanged.fromTime}
                        />,
                        <i key="arrow" className="material-icons pt-2 px-4">
                            arrow_forward
                        </i>,
                        <TimeInput
                            className=""
                            label="To time"
                            name={'toTime'}
                            key={'toTime'}
                            value={formValues.toTime}
                            onChange={handleChange}
                            valid={validTimes || !formChanged.fromTime}
                            changed={formChanged.toTime}
                        />,
                        <HelpHover
                            className="pl-4 pt-1"
                            key="help"
                            text="Search for open time slots within the time period specified by these two inputs."
                        />,
                    ],
                    '',
                    'flex-wrap'
                )}
                {rowWrapper(
                    <i
                        className={
                            'text-3xl material-icons pt-2' +
                            ' ' +
                            (validMeetingLength ? 'text-green-dark' : '')
                        }
                    >
                        hourglass_full
                    </i>,
                    [
                        <TimeInput
                            className=""
                            label="Meeting length"
                            name={'meetingLength'}
                            key={'meetingLength'}
                            value={formValues.meetingLength}
                            onChange={handleChange}
                            valid={validMeetingLength}
                            changed={formChanged.meetingLength}
                        />,
                        <HelpHover
                            className="pl-4 pt-1"
                            key="help"
                            text="The estimated meeting length. This has to be shorted than the time period selected above."
                        />,
                    ]
                )}
                {rowWrapper(
                    <i
                        className={
                            'text-3xl material-icons pt-2' +
                            ' ' +
                            (allValid ? 'text-green-dark' : '')
                        }
                    >
                        done_outline
                    </i>,
                    <GoogleLogin
                        className="google-button"
                        clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                        buttonText="Create meeting"
                        onSuccess={responseGoogle}
                        onFailure={onGoogleFailure}
                        cookiePolicy={'single_host_origin'}
                        scope={
                            'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
                        }
                        disabled={!allValid}
                    />
                )}
            </form>
            <Logo className="w-16 fixed px-1 pin-t pin-r bg-white rounded m-6 invisible md:visible" />
        </div>
    )
}
export default CreateGroup
