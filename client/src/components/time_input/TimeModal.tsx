import React, {FC, useState} from 'react';
import { Time } from '../../api/models';

interface TimeModalProps {
    hover: number;
    setHover(index: number): void;
    title: string;
    numOptions: number;
    left: boolean;
    onChange(value: string, left: boolean): void;
}

const TimeModal: FC<TimeModalProps> = ({setHover, hover, title, numOptions, left, onChange}) => <div 
        className={"absolute pin-t mt-10 w-1/2 z-10  border border-white"
            + " " + (left ? "pin-l rounded-l" : "pin-r border-l-0 rounded-r")}
    >
    <div 
        className={"relative h-64 overflow-hidden"}
        onMouseLeave={() => setHover(-1)}
    >
        <div className={"absolute pin-x bg-white text-black font-semibold text-center py-2 border-grey-light"
            +" " + (left ? "border-r" : "border-l")}
        >
            {title}
        </div>
        <div className="h-full w-full overflow-y-scroll"
            style={{
                paddingRight: '17px',
                boxSizing: 'content-box'
            }}
        >
            {Array.from(Array(numOptions)).map((v, idx) => {
                if (!left && idx % 5 !== 0) {
                    return null;
                } 
                return (<div 
                    key={idx}
                    className={"cursor-pointer flex justify-center text-xs bg-grey" + " " + (idx === 0 ? "pt-10": "")}
                    onMouseEnter={() => setHover(idx)}
                    onClick={() => onChange((idx > 9 ? "" + idx : "0" + idx), left)}
                >
                    <div className={"p-2 pointer-events-none"+ " " + (hover === idx ? "bg-blue-dark rounded" : "")}>
                        {idx > 9 ? idx : "0" + idx}
                    </div>
                </div>)
            })}
        </div>
    </div>
</div>

export default TimeModal;