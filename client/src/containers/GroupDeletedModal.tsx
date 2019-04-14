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
    closeGroupDeletedModal(): void
}

const GroupDeletedModal: React.FC<GroupDeletedModal> = ({
    closeGroupDeletedModal,
}) => {
    return (
        <div>
            <div className="absolute flex items-center justify-center pin bg-grey-darkest opacity-50 z-10" />
            <div
                onClick={() => closeGroupDeletedModal()}
                className="absolute flex flex-col items-center justify-center pin z-20 "
            >
                <div
                    onClick={event => {
                        event.stopPropagation()
                    }}
                    className="bg-grey-darkest text-white rounded shadow mx-8"
                >
                    <div className="flex justify-end m-8 mt-2 mr-2">
                        <i
                            className={
                                'text-3xl material-icons text-white cursor-pointer'
                            }
                            onClick={() => closeGroupDeletedModal()}
                        >
                            close
                        </i>
                    </div>

                    <div className="m-8 text-lg">
                        This group has been deleted!
                    </div>
                    <div className="flex m-8 items-center justify-center">
                    <LinkButton
                        to="/"
                        text="Back to Start Page"
                        className=""
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupDeletedModal

