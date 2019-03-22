import React, {FC} from 'react';
import DatePicker from "react-datepicker";
import { MyDate } from '../api/models';

interface DateInputProps {
    className?: string;
    selected: MyDate;

}

const DateInput: FC<DateInputProps> = ({className}) => {

    return <div className={className }>
        <div>Enter start date"</div>
        {/* <DatePicker
            className="p-2"
            selected={formValues.startDate}
            selectsStart
            startDate={formValues.startDate}
            endDate={formValues.endDate}
            dateFormat="yyyy/MM/dd"
            onChange={(date: Date) => setFormValues({...formValues, ["startDate"]:date})}
            /> */}
    </div>
}

export default DateInput;