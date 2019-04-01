import React, { FC } from 'react'
import { RouteComponentProps } from 'react-router'
import AnimLogo from '../components/logo/AnimLogo'
import LinkButton from '../components/LinkButton'

const bulletPoint = (color: string, text: string) => (
    <div className="flex-1 flex flex-col items-center bg-grey-darkest rounded text-center m-4 p-4 shadow-inner">
        <div className={'mb-4 dot ' + color} />
        {text}
    </div>
)

const StartPage: FC<RouteComponentProps<any>> = () => {
    return (
        <div className="min-h-screen flex flex-col items-center bg-grey-darkest text-white">
            <div className="w-64 flex-1 flex-no-shrink flex items-end">
                <AnimLogo className="" />
            </div>
            <div className="text-2xl text-center w-1/3-when-big mx-4 font-semibold">
                Create a new meeting and invite your colleagues to find a time
                slot where everyone is available!
            </div>
            <div className="mt-6 z-10">
                <LinkButton
                    to="/creategroup"
                    text="Create new meeting"
                    className=""
                />
            </div>
            <div className="w-full bg-grey-darker -mt-4 z-0 pt-4">
                <h2 className="mt-12 ml-12">GET STARTED:</h2>
                <div className="flex justify-around flex-wrap mb-12 mx-8">
                    {bulletPoint(
                        'bg-red-dark',
                        'Click the Create a new group button!'
                    )}
                    {bulletPoint(
                        'bg-yellow-dark',
                        'Specifying between which dates and times you want the meeting to take place!'
                    )}
                    {bulletPoint(
                        'bg-green-light',
                        'Copy the invitation link and send to your colleagues!'
                    )}
                </div>
            </div>
            <div className="flex-1 w-full text-grey-dark bg-white flex justify-end items-end">
                <div className="text-xs p-2">
                    Copyright &copy; Anton Stagge, Cristian Osorio Bretti, Marko
                    Lazic, Erik Björck
                </div>
            </div>
        </div>
    )
}

export default StartPage
