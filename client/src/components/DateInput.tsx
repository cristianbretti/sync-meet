import React, {FC, useState} from 'react';
import DatePicker from "react-datepicker";
import { MyDate } from '../api/models';
import InputWrapper from './InputWrapper';

interface DateInputProps {
    className?: string;
    label: string;
    name: string;
    value: MyDate;
    startDate: MyDate;
    endDate: MyDate;
    selectsStart: boolean;
    selectsEnd: boolean;
    valid: boolean;
    changed: boolean;
    onChange(name:string, value: MyDate): void;
}

class CustomInput extends React.Component<any> {
    render() {
        return (
        <input 
            {...this.props}
            readOnly={window.outerWidth < 700}
        />
        )
    }
}

const DateInput: FC<DateInputProps> = ({className, label, name, value, startDate, endDate, selectsStart, selectsEnd, valid, changed, onChange}) => {
    return (
        <InputWrapper
            className={className}
            label={label}
            name={name}
            active={false}
            valid={valid}
            changed={changed}
        >
            <DatePicker
                className="bg-inherit py-2 text-inherit outline-none"
                customInput={<CustomInput />}
                selected={value.date}
                selectsStart={selectsStart}
                selectsEnd={selectsEnd}
                startDate={startDate.date}
                endDate={endDate.date}
                dateFormat="yyyy-MM-dd"
                onChange={(date: Date) => onChange(name, new MyDate({date: date}))}
            />
        </InputWrapper>
    )
}

export default DateInput;