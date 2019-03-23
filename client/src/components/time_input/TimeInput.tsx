import React, {FC, useState, useRef} from 'react';
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
    const [currentValue, setCurrentValue] = useState(value);
    const lastChanged = useRef(false);
    const [active, setActive] = useState(false);
    const [typeing, setTyping] = useState(value.toString());


    const reset = () => {
        setCurrentValue(value)
        lastChanged.current = false;
        setTyping("empty")
        setActive(false);
        onChange(name, value);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13 || event.keyCode === 9) {
            try {
                const newTime = new Time(typeing);
                if (isNaN(newTime.getHours())) {
                    throw "is nan";
                }
                setCurrentValue(newTime);
                lastChanged.current = false;
                setTyping("empty")
                onChange(name, newTime);
            } catch {
                console.log("here bad")
                reset();
            }
        }
        if (event.keyCode === 13) {
            // Tab and enter do same thing
            const e2 = event as any;
            const form = e2.target.form;
            let index = Array.prototype.indexOf.call(form, e2.target);
            index += 1;
            // find the next HTMLINPUT
            while (form.elements[index].tagName !== "INPUT") {
                index += 1;
                if (index >= form.elements.length) {
                    return;
                }
            }
            form.elements[index].focus();
            e2.preventDefault();
        }
    }

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTyping(event.target.value);
    }

    const handleHourChange = (newValue: number) => {
        typeing !== "empty" ? setTyping("empty") : null;
        let timeString = (newValue > 9 ? newValue : "0" + newValue) 
            + ":" + (currentValue.getMinutes() > 9 ? currentValue.getMinutes() : "0" + currentValue.getMinutes());
        const newTime = new Time(timeString);
        setCurrentValue(newTime);
        lastChanged.current = true;
        if (changed) {
            onChange(name, newTime);
        }
    }

    const handleMinChange = (newValue: number) => {
        typeing !== "empty" ? setTyping("empty") : null;
        let timeString = (currentValue.getHours() > 9 ? currentValue.getHours() : "0" + currentValue.getHours()) 
            + ":" + (newValue > 9 ? newValue : "0" + newValue);
        const newTime = new Time(timeString);
        setCurrentValue(newTime);
        lastChanged.current = false;
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
                    className="bg-inherit py-2 text-inherit outline-none" 
                    readOnly={window.outerWidth < 700}
                    value={(!changed && !active
                        ? ""
                        : typeing !== "empty" 
                            ? typeing
                            : changed 
                                ? currentValue.toString() 
                                : active
                                    ? currentValue.toString()
                                    : "")}
                    onChange={handleTypeChange}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                        e.persist();
                        setActive(true);
                        setTimeout(()  => e.target.select(), 100)  
                    }}
                    onBlur={(e) => {
                        e.persist();
                        setTimeout(()=> {
                            if (typeing !== "empty") {
                                setTyping("empty")
                            }
                            if (changed) {
                                setActive(false);
                            } else if (!lastChanged.current) {
                                setActive(false);
                            } else {
                                e.target.focus()
                            }
                        }, 200)
                    }}
                    onClick={() => setActive(true)}
                />
                {active
                    ? <TimeModal
                        currentValue={currentValue}
                        onHourChange={handleHourChange}
                        onMinChange={handleMinChange}
                        setActive={setActive}
                    />
                    : null
                }
            </div>
        </InputWrapper>
    )
}

export default TimeInput;