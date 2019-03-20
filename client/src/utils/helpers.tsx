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