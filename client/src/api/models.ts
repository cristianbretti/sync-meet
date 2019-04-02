export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum SocketENUM {
    JOIN = 'join',
    LEAVE = 'leave',
    DELETE = 'delete',
    UPDATE = 'update',
}

export class MyDate {
    public date: Date
    constructor(init: { date_str?: string; date?: Date }) {
        if (init.date_str !== undefined) {
            this.date = new Date(init.date_str)
        } else if (init.date !== undefined) {
            this.date = new Date(init.date)
        } else {
            this.date = new Date()
        }
    }
    public toString() {
        return this.date.toLocaleString('sv').substr(0, 10)
    }

    public toJSON() {
        return this.date.toLocaleString('sv').substr(0, 10)
    }

    public getDate() {
        return this.date.getDate()
    }

    public getDayString() {
        return this.date.toLocaleDateString('en-us', { weekday: 'short' })
    }
}

export class Time {
    public time: Date
    constructor(time_str: string) {
        //03:30
        if (time_str.length === 3) {
            //330
            time_str = '0' + time_str.substr(0, 1) + ':' + time_str.substr(1, 2)
        } else if (time_str.length === 4) {
            //3.30 or 3:30
            if (
                time_str.includes('.') ||
                time_str.includes(':') ||
                time_str.includes(',') ||
                time_str.includes(';')
            ) {
                time_str =
                    '0' + time_str.substr(0, 1) + ':' + time_str.substr(2, 2)
            } else {
                //  0300
                time_str = time_str.substr(0, 2) + ':' + time_str.substr(2, 2)
            }
        }
        this.time = new Date('2019-01-01T' + time_str + ':00+01:00')
    }
    public toString() {
        return this.time.toTimeString().substr(0, 5)
    }

    public toJSON() {
        return this.time.toTimeString().substr(0, 5)
    }

    public getHours() {
        return this.time.getHours()
    }
    public getMinutes() {
        return this.time.getMinutes()
    }
    public valueOf() {
        return this.time.valueOf()
    }
}

export interface ErrorResponse {
    status: number
    error: string
}

export interface CreateGroupResponse {
    group_str_id: string
    google_id: string
}

export interface CreateGroupBody {
    group_name: string
    from_date: MyDate
    to_date: MyDate
    from_time: Time
    to_time: Time
    meeting_length: Time
    user_name: string
    access_token: string
    id_token: string
}

export interface AddUserBody {
    name: string
    access_token: string
    id_token: string
}

export interface AddUserResponse {
    google_id: string
}

export interface CalendarEvent {
    date: MyDate
    from_time: Time
    to_time: Time
}

export interface CalendarEventResponse {
    date: string
    from_time: string
    to_time: string
}

export interface DBUser {
    id: number
    name: string
}

export interface Group {
    name: string
    from_date: MyDate
    to_date: MyDate
    from_time: Time
    to_time: Time
    meeting_length: Time
}

export interface GroupResponse {
    name: string
    from_date: string
    to_date: string
    from_time: string
    to_time: string
    meeting_length: string
}

export interface GroupInfoResponse {
    events: CalendarEventResponse[]
    owner: DBUser
    users: DBUser[]
    you: number
    group: GroupResponse
}

export interface GroupInfo {
    events: CalendarEvent[]
    owner: DBUser
    users: DBUser[]
    you: number
    group: Group
}

export interface BadAccessToken {
    cluprit: number
    you: number
}

export type GetGroupCalendarResponseSuccess = { success: true } & GroupInfo

export type GetGroupCalendarResponseFailure = {
    success: false
} & BadAccessToken

export type GetGroupCalendarResponse =
    | GetGroupCalendarResponseSuccess
    | GetGroupCalendarResponseFailure

export interface EmptyResponse {}

export interface UpdateAccessTokenBody {
    access_token: string
}

export interface LoggedIn {
    success: true
    google_id: string
}

export interface LoggedOut {
    success: false
}
