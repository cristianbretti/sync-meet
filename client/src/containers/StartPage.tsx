import React, { FC } from 'react'
import { RouteComponentProps } from 'react-router'
import AnimLogo from '../components/logo/AnimLogo'
import LinkButton from '../components/LinkButton'

const bulletPoint = (color: string, text: string) => (
    <div className="flex flex-col items-center bg-grey-darker rounded text-center p-4 mr-4 shadow-inner">
        {/* <div className={'mb-4 dot ' + color} /> */}
        {text}
    </div>
)

const StartPage: FC<RouteComponentProps<any>> = () => {
    return (
        <div className="min-h-screen flex flex-col bg-grey-darkest text-white overflow-hidden">
            <div className="flex-no-grow flex">
                <div className="flex-1 flex flex-col justify-center items-end bg-white text-grey-darkest pr-4 ">
                    <div className="w-48 ml-4 hidden md:block">
                        <AnimLogo className="" />
                    </div>
                </div>
                <div className="flex-3 pl-4 flex items-center">
                    <div className="w-32 block md:hidden bg-white rounded px-1 mt-4">
                        <AnimLogo className="" />
                    </div>
                    <div className="text-2xl font-semibold hidden md:flex">
                        <div className="flex-1 ">
                            Find a time slot where you and your collegues are
                            all free for a meeting!
                        </div>
                        <div className="flex-1" />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col items-end bg-white text-grey-darkest pr-4">
                    <div className="flex-1 flex items-center">
                        <i className={'text-4xl material-icons text-red-dark'}>
                            looks_one
                        </i>
                    </div>
                </div>
                <div className="flex-3 pl-4 flex items-center">
                    {bulletPoint('bg-red-dark', 'Create a new meeting')}
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col items-end bg-white text-grey-darkest pr-4">
                    <div className="flex-1 flex items-center">
                        <i
                            className={
                                'text-4xl material-icons text-yellow-dark'
                            }
                        >
                            looks_two
                        </i>
                    </div>
                </div>
                <div className="flex-3 pl-4 flex items-center">
                    {bulletPoint(
                        'bg-yellow-dark',
                        'Specifying between which dates and times you want the meeting to take place'
                    )}
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col items-end bg-white text-grey-darkest pr-4">
                    <div className="flex-1 flex items-center">
                        <i
                            className={
                                'text-4xl material-icons text-green-dark'
                            }
                        >
                            looks_3
                        </i>
                    </div>
                </div>
                <div className="flex-3 pl-4 flex items-center">
                    {bulletPoint(
                        'bg-green-light',
                        'Copy the invitation link and send to your colleagues'
                    )}
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col items-end bg-white text-grey-darkest pr-4">
                    <div className="flex-1 flex items-center">
                        <i
                            className={
                                'text-4xl font-bold material-icons text-grey-darkest'
                            }
                        >
                            add
                        </i>
                    </div>
                </div>
                <div className="flex-3 pl-4 flex items-center">
                    <LinkButton
                        to="/creategroup"
                        text="Create new meeting"
                        className=""
                    />
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col items-end bg-white text-grey-darkest pr-4" />
                <div className="flex-3 pl-4">
                    <div className="flex-no-grow h-full flex justify-end items-end">
                        <div className="text-xs p-2">
                            Copyright &copy; Anton Stagge, Cristian Osorio
                            Bretti, Marko Lazic, Erik Björck
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartPage
