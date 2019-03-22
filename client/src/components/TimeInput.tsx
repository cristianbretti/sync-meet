import React, {FC, useState} from 'react';
import DatePicker from "react-datepicker";
import { MyDate } from '../api/models';
import InputWrapper from './InputWrapper';

interface TimeInputProps {
    className?: string;
    label: string;
    name: string;
    value: Date;
    onChange(name:string, value: Date): void;
}


const TimeInput: FC<TimeInputProps> = ({className, label, name, value, onChange}) => {
    const [active, setActive] = useState(false);
    const [hover, setHover] = useState(-1);
    return (
        <InputWrapper
            className={className}
            label={label}
            name={name}
            active={active}
            valid={true}
            changed={false}
        >
            {/* <DatePicker
                className="bg-inherit py-2 text-inherit outline-none"
                selected={value}
                showTimeSelect
                showTimeSelectOnly
                dateFormat="HH:mm"
                timeCaption="Time"
                onChange={(date: Date) => onChange(name, date)}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
            /> */}
            <div className="relative">
                <input type="text" 
                    className="bg-inherit py-2 text-inherit outline-none text-center" value="08:00"

                />
                <div className="absolute pin-t pin-l mt-8 h-64 w-1/2 overflow-y-scroll z-10 rounded border border-white"
                    onMouseLeave={() => setHover(-1)}
                >
                    <div className="fixed bg-white text-black font-semibold text-center py-2 px-6">Hour</div>
                    {Array.from(Array(24)).map((v, idx) => <div 
                        key={idx}
                        className={"flex justify-center text-xs bg-grey" + " " + (idx === 0 ? "pt-10": "")}
                        onMouseEnter={() => setHover(idx)}
                        >
                            <div className={"p-2"+ " " + (hover === idx ? "bg-blue-dark rounded" : "")}>
                                {idx > 9 ? idx : "0" + idx}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </InputWrapper>
    )
}

export default TimeInput;

interface TimeModalProps {
    hover: number;
    setHover(index: number): void;
    title: string;
    numOptions: number;
}

const timeModal: FC<TimeModalProps> = ({setHover, hover, title, numOptions}) => <div className="absolute pin-t pin-l mt-8 h-64 w-1/2 overflow-y-scroll z-10 rounded border border-white"
    onMouseLeave={() => setHover(-1)}
    >
    <div className="fixed bg-white text-black font-semibold text-center py-2 px-6">{title}</div>
    {Array.from(Array(numOptions)).map((v, idx) => <div 
        key={idx}
        className={"flex justify-center text-xs bg-grey" + " " + (idx === 0 ? "pt-10": "")}
        onMouseEnter={() => setHover(idx)}
        >
            <div className={"p-2"+ " " + (hover === idx ? "bg-blue-dark rounded" : "")}>
                {idx > 9 ? idx : "0" + idx}
            </div>
        </div>
    )}
</div>