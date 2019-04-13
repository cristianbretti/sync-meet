import React, { useState } from 'react'
import TextInput from '../components/TextInput'
import GoogleLogin, {
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
} from 'react-google-login'
import { AddUserBody, AddUserResponse } from '../api/models'
import api from '../api/api'
import LinkButton from '../components/LinkButton';

interface GroupDeletedModal {
    backToStartPage(): void
}

const GroupDeletedModal: React.FC<GroupDeletedModal> = ({
    backToStartPage,
}) => {
    return (
        <div>
            <div className="absolute flex items-center justify-center pin bg-grey-darkest opacity-50 z-10" />
            <div
                onClick={() => backToStartPage()}
                className="absolute flex flex-col items-center justify-center pin z-20 "
            >
                <div
                    onClick={event => {
                        event.stopPropagation()
                    }}
                    className="bg-grey-darkest text-white rounded shadow mx-8"
                >
                <div className="m-8 text-lg">
                    This group has been deleted!
                </div>
                <div className="flex" />
                </div>
                <LinkButton
                    to="/"
                    text="Back to Start Page"
                    className=""
                />
            </div>
        </div>
    )
}

export default GroupDeletedModal
