import React, {FC, useState} from 'react';
import DatePicker from "react-datepicker";
import { MyDate } from '../api/models';
import InputWrapper from './InputWrapper';

interface DateInputProps {
    className?: string;
    label: string;
    name: string;
    value: Date;
    startDate: Date;
    endDate: Date;
    valid: boolean;
    changed: boolean;
    onChange(name:string, value: Date): void;
}

const DateInput: FC<DateInputProps> = ({className, label, name, value, startDate, endDate, valid, changed, onChange}) => {
    const [active, setActive] = useState(false);
    return (
        <InputWrapper
            className={className}
            label={label}
            name={name}
            active={active}
            valid={valid}
            changed={changed}
        >
            <DatePicker
                className="bg-inherit py-2 text-inherit outline-none"
                selected={value}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
                onChange={(date: Date) => onChange(name, date)}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
            />
        </InputWrapper>
    )
}

export default DateInput;