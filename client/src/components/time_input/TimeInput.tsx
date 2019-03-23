import React, {FC, useState} from 'react';
import { Time } from '../../api/models';
import InputWrapper from '../InputWrapper';
import TimeModal from './TimeModal';

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