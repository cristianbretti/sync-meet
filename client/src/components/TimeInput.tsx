import React, {FC, useState} from 'react';
import DatePicker from "react-datepicker";
import { MyDate, Time } from '../api/models';
import InputWrapper from './InputWrapper';

interface TimeInputProps {
    className?: string;
    label: string;
    name: string;
    value: Time;
    valid: boolean;
    changed: boolean
    onChange(name:string, value: Time): void;
}


const TimeInput: FC<TimeInputProps> = ({className, label, name, value, valid, changed, onChange}) => {
    const [active, setActive] = useState(false);
    const [left, setLeft] = useState(false);
    const [right, setRight] = useState(false);
    const [hoverHour, setHoverHour] = useState(-1);
    const [hoverMin, setHoverMin] = useState(-1);

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const newTime = new Time(event.target.value);
            onChange(name, newTime);
        } catch {
            return;
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        event.persist();
        if (!changed) {
            setLeft(true);
            setRight(true);
        } else {
            const temp = event.target as HTMLInputElement;
            event.pageX >= (temp.getBoundingClientRect().left + temp.clientWidth/2) 
                ? setRight(true)
                : setLeft(true)
        }
    }

    const handleChange = (newValue: string, left: boolean) => {
        let newTimeStr = ""
        if (left) {
            newTimeStr = newValue + ":" + value.toString().substr(3, 2)
        } else {
            newTimeStr =  value.toString().substr(0, 3) + newValue
        }
        const newTime = new Time(newTimeStr);
        left ? setLeft(false) : setRight(false)
        onChange(name, newTime);
    }

    return (
        <InputWrapper
            className={className}
            label={label}
            name={name}
            active={active}
            valid={valid}
            changed={changed}
        >
            <div className="relative">
                <input type="text" 
                    className="bg-inherit py-2 text-inherit outline-none text-center" 
                    value={value.toString()}
                    onChange={handleTypeChange}
                    onFocus={() => setActive(true)}
                    onBlur={() =>  setTimeout(() =>{
                        setActive(false);
                        if (changed) {
                            setLeft(false);
                            setRight(false);
                        }
                    }, 100)}
                    onClick={handleClick}
                />
                {left 
                    ? <TimeModal 
                        setHover={setHoverHour} 
                        hover={hoverHour} 
                        title={"Hour"} 
                        numOptions={24}
                        left={true}
                        onChange={handleChange}
                    />
                    : null
                }
                {right 
                    ? <TimeModal 
                        setHover={setHoverMin} 
                        hover={hoverMin} 
                        title={"Minutes"} 
                        numOptions={60}
                        left={false}
                        onChange={handleChange}
                    />
                    : null
                }
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