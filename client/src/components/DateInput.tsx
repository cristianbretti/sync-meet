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
                customInput={<CustomInput />}
                selected={value.date}
                selectsStart={selectsStart}
                selectsEnd={selectsEnd}
                startDate={startDate.date}
                endDate={endDate.date}
                dateFormat="yyyy-MM-dd"
                onChange={(date: Date) => {
                    setActive(false);
                    onChange(name, new MyDate({date: date}))
                }}
                dayClassName={(date: Date) => {
                    if (date >= startDate.date && date <= endDate.date) {
                        return "bg-blue-dark rounded text-white"
                    }
                    return "text-white";
                }}
                calendarClassName="bg-grey"
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                onClickOutside={() => setActive(false)}
            />
        </InputWrapper>
    )
}

export default DateInput;