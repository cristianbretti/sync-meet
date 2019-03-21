import { CalendarEvent, MyDate } from "../api/models";

export const DateToYYYYMMDD = (date: Date):string => {
    return date.toISOString().substring(0,10)
}

export const DateToHHMM = (date: Date):string => {
    return date.toTimeString().substring(0,5)
}

export const HourAndMinuteToHHMM = (hour: number, minute:number):string => {
    const hourString = hour < 10 ? "0" + hour : "" + hour
    const minuteString = minute < 10 ? "0" + minute : "" + minute
    return hourString + ":" + minuteString
}

export const getUniqueDaysFromListOfEvents = (events: CalendarEvent[]):MyDate[] => {
    let listOfUniqueDays:MyDate[] = []
    for(let event of events){
        let isInList = false;
        for(let uniqueDayEvent of listOfUniqueDays){
            if(event.date.toString() === uniqueDayEvent.toString()){
                isInList = true;
            }
        }
        if(!isInList){
            listOfUniqueDays.push(event.date);
        }
    }
    return listOfUniqueDays;
}