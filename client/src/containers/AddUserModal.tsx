import React, { useState } from 'react'
import TextInput from '../components/TextInput'
import GoogleLogin from 'react-google-login'
import { AddUserBody, AddUserResponse, ErrorResponse } from '../api/models'
import api from '../api/api'

interface AddUserModalProps {
    group_str_id: string
    getCalendarData(group_str_id: string, google_id: string): void
    addUserFailed(error: ErrorResponse): void
}

const AddUserModal: React.FC<AddUserModalProps> = ({
    group_str_id,
    getCalendarData,
    addUserFailed,
}) => {
    const [userName, setUserName] = useState('')

    const responseGoogle = (googleResponse: any) => {
        const access_token = googleResponse.getAuthResponse().access_token
        const id_token = googleResponse.getAuthResponse().id_token
        const newUser: AddUserBody = {
            name: userName,
            access_token,
            id_token,
        }
        api.addUser(newUser, group_str_id)
            .then((resp: AddUserResponse) => {
                getCalendarData(group_str_id, resp.google_id)
            })
            .catch((error: ErrorResponse) => {
                addUserFailed(error)
            })
    }

    const onGoogleFailure = (badRepsonse: any) => {
        addUserFailed(badRepsonse.error || '')
    }

    return (
        <div>
            <div className="absolute flex items-center justify-center pin bg-grey-darkest opacity-50 z-10" />
            <div className="absolute flex flex-col items-center justify-center pin z-20 ">
                <div className="bg-grey-darker text-white rounded shadow p-16 mx-8">
                    <div className="mt-8 text-lg">
                        Enter display name and give access to you calendar to
                        join this meeting...
                    </div>
                    <div className="flex">
                        <TextInput
                            className="my-8 flex-1"
                            label="Your display name"
                            name={'userName'}
                            value={userName}
                            changed={userName !== ''}
                            onChange={(name: string, value: string) =>
                                setUserName(value)
                            }
                            valid={userName !== ''}
                        />
                        <div className="flex-1" />
                    </div>
                    <GoogleLogin
                        className="google-button my-6"
                        clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                        buttonText="Join meeting"
                        onSuccess={responseGoogle}
                        onFailure={onGoogleFailure}
                        cookiePolicy={'single_host_origin'}
                        scope={
                            'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
                        }
                        disabled={userName === ''}
                    />
                </div>
            </div>
        </div>
    )
}

export default AddUserModal
