
export class MyDate extends Date {
    private date: Date;
    constructor(date_str: string) {
        super();
        this.date = new Date(date_str)
    }
    public toString() {
        return this.date.toJSON().substr(0,10);
    }

    public toJSON() {
        return this.date.toJSON().substr(0,10);
    }   
}

export class Time extends Date {
    private time: Date;
    constructor(time_str: string) {
        super();
        this.time = new Date("2019-01-01T"+time_str + ":00+01:00")
    }
    public toString() {
        return this.time.toTimeString().substr(0,5);
    }

    public toJSON() {
        return this.time.toTimeString().substr(0,5);
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

export interface GetGroupCalendarResponse {
    events: CalendarEvent[];
    owner: DBUser;
    users: DBUser[];
    you: number;
    group: Group;
}

export interface EmptyResponse {}

export interface UpdateAccessTokenBody {
    access_token: string;
}