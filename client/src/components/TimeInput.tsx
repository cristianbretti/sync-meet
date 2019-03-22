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
    return (
        <InputWrapper
            className={className}
            label={label}
            name={name}
            active={active}
            valid={true}
            changed={false}
        >
            <DatePicker
                className="bg-inherit py-2 text-inherit outline-none"
                selected={value}
                showTimeSelect
                showTimeSelectOnly
                dateFormat="mm"
                timeCaption="Time"
                onChange={(date: Date) => onChange(name, date)}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
            />
        </InputWrapper>
    )
}

export default TimeInput;