import React, { useState } from 'react'
import TextInput from '../components/TextInput'
import GoogleLogin, {
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
} from 'react-google-login'
import { AddUserBody, AddUserResponse } from '../api/models'
import api from '../api/api'

interface SendLinkModalProps {
    closeSendLinkModal(): void
}

const SendLinkModal: React.FC<SendLinkModalProps> = ({
    closeSendLinkModal,
}) => {
    let linkInput: HTMLInputElement
    const copyLink = () => {
        linkInput.select()
        document.execCommand('copy')
    }
    return (
        <div>
            <div className="absolute flex items-center justify-center pin bg-grey-darkest opacity-50 z-10" />
            <div
                onClick={() => closeSendLinkModal()}
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
                            onClick={() => closeSendLinkModal()}
                        >
                            close
                        </i>
                    </div>

                    <div className="m-8 text-lg">
                        Sent this link to your friends to plan this meeting!
                    </div>
                    <div className="m-8 text-sm flex ">
                        <input
                            ref={(el: HTMLInputElement) => (linkInput = el)}
                            onClick={event =>
                                (event.target as HTMLInputElement).select()
                            }
                            type="text"
                            className="w-full select-text p-2 bg-grey-darker text-white rounded outline-none"
                            readOnly={true}
                            value={window.location.href}
                        />
                        <i
                            className={
                                'text-2xl material-icons text-white cursor-pointer m-2 mr-0'
                            }
                            onClick={copyLink}
                        >
                            file_copy
                        </i>
                    </div>

                    <div className="flex" />
                </div>
            </div>
        </div>
    )
}

export default SendLinkModal
