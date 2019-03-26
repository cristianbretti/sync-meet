
export class MyDate{
    public date: Date;
    constructor(init: {date_str?:string, date?: Date}) {
        if (init.date_str !== undefined) {
            this.date = new Date(init.date_str)
        } else if (init.date !== undefined) {
            this.date = init.date;
        } else {
            this.date = new Date();
        }
    }
    public toString() {
        return this.date.toLocaleString().substr(0,10);
    }

    public toJSON() {
        return this.date.toLocaleString().substr(0,10);
    }
}

export class Time{
    public time: Date;
    constructor(time_str: string) {
        
        
        //03:30
        if (time_str.length === 3) {
            //330
            time_str = "0" + time_str.substr(0, 1) + ":" + time_str.substr(1, 2)
        } else if (time_str.length === 4) {
            //3.30 or 3:30 
            if (time_str.includes(".") || time_str.includes(":") || time_str.includes(",") || time_str.includes(";")) {
                time_str = "0" + time_str.substr(0, 1) + ":" + time_str.substr(2, 2)
            } else {
                //  0300
                time_str = time_str.substr(0, 2) + ":" + time_str.substr(2, 2)
            }
        }
        this.time = new Date("2019-01-01T"+time_str + ":00+01:00")
    }
    public toString() {
        return this.time.toTimeString().substr(0,5);
    }

    public toJSON() {
        return this.time.toTimeString().substr(0,5);
    }

    public getHours() {
        return this.time.getHours();
    }
    public getMinutes() {
        return this.time.getMinutes();
    }
}

export interface ErrorResponse {
    status: number;
    error: string;
}

export interface CreateGroupResponse {
    group_str_id: string;
    google_id: string;
}

export interface CreateGroupBody {
    group_name: string;
    from_date: MyDate;
    to_date: MyDate;
    from_time: Time;
    to_time: Time;
    meeting_length: Time;
    user_name: string;
    access_token: string;
    id_token: string;
}

export interface AddUserBody {
    name: string;
    access_token: string;
    id_token: string;
}

export interface AddUserResponse {
    google_id: string;
}


export interface CalendarEvent {
    date: MyDate;
    from_time: Time;
    to_time: Time; 
}

export interface DBUser {
    id: number;
    name: string;
}

export interface Group {
    name: string;
    from_date: MyDate;
    to_date: MyDate;
    from_time: Time;
    to_time: Time;
    meeting_length: Time;
}

export interface GetGroupCalendarResponseSuccess {
    success: true;
    events: CalendarEvent[];
    owner: DBUser;
    users: DBUser[];
    you: number;
    group: Group;
}

export interface GetGroupCalendarResponseFailure {
    success: false;
    cluprit: number;
    you: number;
}

export type GetGroupCalendarResponse = GetGroupCalendarResponseSuccess | GetGroupCalendarResponseFailure;

export interface EmptyResponse {}

export interface UpdateAccessTokenBody {
    access_token: string;
}