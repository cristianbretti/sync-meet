import React, { useState } from 'react'
import LinkButton from '../components/LinkButton';

interface WarningPopupModal {
    closeModal(): void,
    title: string,
    buttonText: string,
    buttonClicked(): void
}

const WarningPopupModal: React.FC<WarningPopupModal> = ({
    closeModal,
    title,
    buttonText,
    buttonClicked
}) => {
    return (
        <div>
            <div className="absolute flex items-center justify-center pin bg-grey-darkest opacity-50 z-10" />
            <div
                onClick={() => closeModal()}
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
                            onClick={() => closeModal()}
                        >
                            close
                        </i>
                    </div>

                    <div className="m-8 text-lg">
                        {title}
                    </div>
                    <div className="flex m-8 items-center justify-center">
                    <button 
                        onClick={()=> buttonClicked()} 
                        className={ 'no-underline text-inherit p-2 block rounded bg-green-dark hover:bg-green-darker hover:shadow-inner shadow focus:outline-none'}>
                        {buttonText}
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WarningPopupModal

