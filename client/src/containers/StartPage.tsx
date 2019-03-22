import React, {FC} from 'react';
import { RouteComponentProps } from 'react-router';
import AnimLogo from '../components/logo/AnimLogo';
import { Link } from 'react-router-dom';
import LinkButton from '../components/LinkButton';


const bulletPoint = (color:string, text:string) => (
    <div className="flex-1 flex flex-col items-center bg-grey-dark rounded m-4 p-4 text-center">
        <div className={"dot " + color}/>
        {text}
    </div>
);

const StartPage: FC<RouteComponentProps<any>> = () => {
    return <div className="flex flex-col items-center justify-center">
        <AnimLogo className="w-64 flex-1 justify-end mt-4"/>
        <div className="text-2xl w-1/3 text-center flex-no-shrink">
            Create a new meeting and invite your colleagues to find a time slot 
            where everyone is available!
        </div>
        <div className="flex-1 mt-6 z-10">
            <LinkButton to="/creategroup" text="Create new meeting" className="" />
        </div>
        <div className="w-full bg-grey-darker -mt-4 z-0 pt-4">
            <h1 className="mt-12 ml-12">How to get started:</h1>
            <div className="flex mx-8 mt-4 mb-12">
                {bulletPoint("bg-red", "Click the Create a new group button!")}
                {bulletPoint("bg-yellow", "Specifying between which dates and times you want the meeting to take place!")}
                {bulletPoint("bg-green", "Copy the link and send to your colleagues to invite them!")}
            </div>
        </div>
        <div className="fixed pin-b pin-r text-grey-dark bg-white text-right text-xs p-2">
            Copyright &copy; Anton Stagge, Cristian Osorio Bretti, Marko Lazic, Erik Björck
        </div>
    </div>
}

export default StartPage