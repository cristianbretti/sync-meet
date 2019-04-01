import io from 'socket.io-client'
import {
    Time,
    MyDate,
    CreateGroupResponse,
    ErrorResponse,
    CreateGroupBody,
    AddUserBody,
    AddUserResponse,
    GetGroupCalendarResponse,
    EmptyResponse,
    UpdateAccessTokenBody,
    HTTPMethod,
    SocketENUM,
    LoggedIn,
    LoggedOut,
    GroupInfo,
    BadAccessToken,
    GetGroupCalendarResponseFailure,
    GetGroupCalendarResponseSuccess,
    GroupInfoResponse,
    Group,
    CalendarEventResponse,
    CalendarEvent,
} from './models'

//Use this when running client served from server
let baseURLEndpoint = location.origin

if (location.hostname === 'localhost') {
    baseURLEndpoint = 'http://localhost:5000'
}

class API {
    private socket: SocketIOClient.Socket
    constructor() {
        this.socket = io.connect(baseURLEndpoint)
        this.socket.on('message', (msg: SocketENUM) => {
            console.log(msg)
        })
    }

    setReciveCallback = (callback: (msg: SocketENUM) => void) => {
        this.socket.off('message') // remove all other listeners
        this.socket.on('message', callback)
    }

    login = (group_str_id: string, google_id: string, expires: MyDate) => {
        const expires_date = new Date(expires.date)
        expires_date.setHours(23)
        expires_date.setMinutes(59)
        setCookie(group_str_id, google_id, expires_date)
    }

    logout = (group_str_id: string, google_id: string) => {
        document.cookie =
            group_str_id +
            '=' +
            google_id +
            ';expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    }

    isLoggedIn = (group_str_id: string): LoggedIn | LoggedOut => {
        const google_id = getCookie(group_str_id)
        if (google_id !== null) {
            return { success: true, google_id }
        }
        return { success: false }
    }

    private request = (
        endpoint: string,
        method: HTTPMethod,
        authentication: { google_id?: string; group_str_id?: string },
        body?: any
    ) => {
        const headers = new Headers()
        headers.append('Accept', 'application/json')
        headers.append('Content-Type', 'application/json')
        headers.append(
            'google_id',
            authentication.google_id !== undefined
                ? authentication.google_id
                : ''
        )
        headers.append(
            'group_str_id',
            authentication.group_str_id !== undefined
                ? authentication.group_str_id
                : ''
        )

        let options: RequestInit = {
            method: method,
            headers: headers,
            mode: 'cors', //TODO: dev only, delete otherwise
        }

        if (body !== undefined) {
            options = { ...options, body: JSON.stringify(body) }
        }

        return fetch(baseURLEndpoint + '/api/' + endpoint, options)
            .then(handleErrors)
            .then(response => response.json())
    }

    /**
     * Socket-io event emitters
     */
    join = (group_str_id: string) =>
        this.socket.emit(SocketENUM.JOIN, group_str_id)
    leave = (group_str_id: string) =>
        this.socket.emit(SocketENUM.LEAVE, group_str_id)
    delete = (group_str_id: string) =>
        this.socket.emit(SocketENUM.DELETE, group_str_id)
    update = (group_str_id: string) =>
        this.socket.emit(SocketENUM.UPDATE, group_str_id)

    createGroup = (group: CreateGroupBody): Promise<CreateGroupResponse> => {
        return this.request('creategroup', HTTPMethod.POST, {}, group).then(
            (resp: CreateGroupResponse) => {
                this.join(resp.group_str_id)
                return resp
            }
        )
    }

    addUser = (
        user: AddUserBody,
        google_id: string,
        group_str_id: string
    ): Promise<AddUserResponse> => {
        return this.request(
            'adduser',
            HTTPMethod.POST,
            { google_id: google_id, group_str_id: group_str_id },
            user
        ).then((resp: AddUserResponse) => {
            this.join(group_str_id)
            return resp
        })
    }

    getGroupCalendar = (
        google_id: string,
        group_str_id: string
    ): Promise<GetGroupCalendarResponse> => {
        return this.request('getgroupcalendar', HTTPMethod.GET, {
            google_id: google_id,
            group_str_id: group_str_id,
        }).then((resp: GroupInfoResponse | BadAccessToken) => {
            if ('culprit' in resp) {
                return {
                    ...(resp as BadAccessToken),
                    success: false,
                } as GetGroupCalendarResponseFailure
            } else {
                resp = resp as GroupInfoResponse
                const group = {
                    name: resp.group.name,
                    from_date: new MyDate({ date_str: resp.group.from_date }),
                    to_date: new MyDate({ date_str: resp.group.to_date }),
                    to_time: new Time(resp.group.to_time),
                    from_time: new Time(resp.group.from_time),
                    meeting_length: new Time(resp.group.meeting_length),
                } as Group
                const events = resp.events.map(
                    (ev: CalendarEventResponse): CalendarEvent => ({
                        date: new MyDate({ date_str: ev.date }),
                        from_time: new Time(ev.from_time),
                        to_time: new Time(ev.to_time),
                    })
                )
                return {
                    ...resp,
                    group,
                    events,
                    success: true,
                } as GetGroupCalendarResponseSuccess
            }
        })
    }

    remove = (
        owner: boolean,
        google_id: string,
        group_str_id: string
    ): Promise<EmptyResponse> => {
        return this.request('remove', HTTPMethod.DELETE, {
            google_id: google_id,
            group_str_id: group_str_id,
        }).then(resp => {
            if (owner) {
                this.delete(group_str_id)
            } else {
                this.leave(group_str_id)
            }
            return resp
        })
    }

    updateAccessToken = (
        access_token_body: UpdateAccessTokenBody,
        google_id: string,
        group_str_id: string
    ): Promise<EmptyResponse> => {
        return this.request(
            'remove',
            HTTPMethod.PUT,
            { google_id: google_id, group_str_id: group_str_id },
            access_token_body
        ).then(resp => {
            this.update(group_str_id)
            return resp
        })
    }
}
const api = new API()
export default api

/**
 * Convert bad requests into errors
 */
const handleErrors = (response: any) => {
    if (!response.ok) {
        return response.json().then((resp: any) => {
            throw {
                ...resp,
                status: response.status,
            } as ErrorResponse
        })
    }
    return response
}

const setCookie = (cname: string, cvalue: string, expires: Date) => {
    const expires_str = 'expires=' + expires.toUTCString()
    const newCookie = cname + '=' + cvalue + ';' + expires_str + ';path=/'
    document.cookie = newCookie
}

const getCookie = (cname: string): string | null => {
    var name = cname + '='
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return null
}
