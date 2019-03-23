import React, {FC, useState} from 'react';
import DatePicker from "react-datepicker";
import { MyDate } from '../api/models';
import InputWrapper from './InputWrapper';
import "react-datepicker/dist/react-datepicker.css";

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
    onChange(name:string, value: MyDate): void;
}

class CustomInput extends React.Component<any> {
    render() {
        const tempProps = {...this.props,
            value: this.props.changed ? this.props.value : "",
            changed: undefined
        }
        return (
        <input 
            {...tempProps}
            readOnly={window.outerWidth < 700}
        />
        )
    }
}

const DateInput: FC<DateInputProps> = ({className, label, name, value, startDate, endDate, selectsStart, selectsEnd, valid, onChange}) => {
    const [active, setActive] = useState(false);
    const [changed, setChanged] = useState(false);
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
                customInput={<CustomInput changed={changed} />}
                selected={value.date}
                selectsStart={selectsStart}
                selectsEnd={selectsEnd}
                startDate={startDate.date}
                endDate={endDate.date}
                dateFormat="yyyy-MM-dd"
                onChange={(date: Date) => {
                    setActive(false);
                    setChanged(true);
                    onChange(name, new MyDate({date: date}))
                }}
                dayClassName={(date: Date) => {
                    if (date >= startDate.date && date <= endDate.date) {
                        return "bg-blue-dark rounded text-white"
                    }
                    return null;
                }}
                onSelect={(date: Date) => {
                    // This fires even when you pick the same date.
                    if (date.toDateString() === value.date.toDateString()) {
                        setActive(false);
                        setChanged(true);
                        onChange(name, new MyDate({date: date}))
                    }
                }}
                // Tab and enter do same thing
                onKeyDown={(e) => {
                    if (e.keyCode === 9) {
                        onChange(name, value);
                    } else if (e.keyCode === 13) {
                        const e2 = e as any;
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
                }}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                onClickOutside={() => setActive(false)}
            />
        </InputWrapper>
    )
}

export default DateInput;