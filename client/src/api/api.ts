import io from 'socket.io-client';
import {Time, 
    MyDate, 
    CreateGroupResponse, 
    ErrorResponse,
    CreateGroupBody,
    AddUserBody,
    AddUserResponse,
    GetGroupCalendarResponse,
    EmptyResponse,
    UpdateAccessTokenBody,
} from './models';

//Use this when running client served from server
let baseURLEndpoint = location.origin;

if (location.hostname === 'localhost') {
    baseURLEndpoint = 'http://localhost:5000'
}



/**
 * Convert bad requests into errors
 */
const handleErrors = (response: any) => {
    if (!response.ok) {
        return response.json().then((resp :any)=> {
            throw {
                ...resp,
                status: response.status
            } as ErrorResponse;
        }); 
    }
    return response;
}

class API {
    socket: SocketIOClient.Socket
    constructor() {
        this.socket = io.connect(baseURLEndpoint);
        this.socket.on('message', (msg: string) => {
            console.log(msg);
        });
    }

    setReciveCallback = (callback: (msg: string) => void) => {
        this.socket.off('message'); // remove all other listeners
        this.socket.on('message', callback);
    }

    request = (endpoint: string, method: "GET"|"POST"|"PUT"|"DELETE", authentication: {google_id?: string, group_str_id?: string}, body?: any) => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('google_id', authentication.google_id !== undefined ? authentication.google_id : '');
        headers.append('group_str_id', authentication.group_str_id !== undefined ? authentication.group_str_id : '');

        let options: RequestInit = {
            method: method,
            headers: headers,
            mode: "cors", //TODO: dev only, delete otherwise
        }

        if (body !== undefined) {
            options = {...options, body: JSON.stringify(body)}
        }

        return fetch(baseURLEndpoint + '/api/' + endpoint, options)
        .then(handleErrors)
        .then(response => response.json())
    }

    /**
     * Socket-io event emitters
     */
    join = (group_str_id: string) => this.socket.emit('join', group_str_id);
    leave = (group_str_id: string) => this.socket.emit('leave', group_str_id);
    delete = (group_str_id: string) => this.socket.emit('delete', group_str_id);
    update = (group_str_id: string) => this.socket.emit('update', group_str_id);


    createGroup = (group: CreateGroupBody): Promise<CreateGroupResponse> => {
        return this.request('creategroup', 'POST', {}, group)
            .then((resp: CreateGroupResponse) => {
                this.join(resp.group_str_id);
                return resp;
            });
    }

    addUser = (user: AddUserBody, google_id: string, group_str_id: string): Promise<AddUserResponse> => {
        return this.request('adduser', 'POST', {google_id: google_id, group_str_id: group_str_id}, user)
            .then((resp: AddUserResponse) => {
                this.join(group_str_id);
                return resp;
            });
    }

    getGroupCalendar = (google_id: string, group_str_id: string): Promise<GetGroupCalendarResponse> => {
        return this.request('getgroupcalendar', 'GET', {google_id: google_id, group_str_id: group_str_id});
    }

    remove = (owner: boolean, google_id: string, group_str_id: string): Promise<EmptyResponse> => {
        return this.request('remove', 'DELETE', {google_id: google_id, group_str_id: group_str_id})
            .then(resp => {
                if (owner) {
                    this.delete(group_str_id);
                } else {
                    this.leave(group_str_id);
                }
                return resp;
            })
    }

    updateAccessToken = (access_token_body: UpdateAccessTokenBody, google_id: string, group_str_id: string): Promise<EmptyResponse> => {
        return this.request('remove', 'DELETE', {google_id: google_id, group_str_id: group_str_id}, access_token_body)
            .then(resp => {
                this.update(group_str_id);
                return resp;
            })
    }

}
const api = new API();
export default api;