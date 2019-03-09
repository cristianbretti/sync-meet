import io from 'socket.io-client';

/**
 * Convert bad requests into errors
 */
const handleErrors = (response: any) => {
    if (!response.ok) {
        throw response;
    }
    return response;
}

class API {
    socket: SocketIOClient.Socket
    constructor() {
        console.log(location.href);
        this.socket = io.connect('http://localhost:5000'); // change to location.href
        this.socket.on('message', (msg: string) => {
            console.log(msg);
        });
    }

    setReciveCallback = (callback: (msg: string) => void) => {
        this.socket.off('message'); // remove all other listeners
        this.socket.on('message', callback);
    }

    request = (endpoint: string, method: "GET"|"POST"|"PUT"|"DELETE", authentication: {google_id?: string, group_str_id?: string}, body: any, callback: (responsObj: any) => void, errorCallback?: (error: any) => void) => {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('google_id', authentication.google_id !== undefined ? authentication.google_id : '');
        headers.append('group_str_id', authentication.group_str_id !== undefined ? authentication.group_str_id : '');
        //TODO: change to just '/api/' + endpoint
        fetch('http://localhost:5000' + '/api/' + endpoint, {
            method: method,
            headers: headers,
            body: JSON.stringify(body),

            credentials: 'include', //TODO: dev only, use same-origin otherwise
            mode: "cors", //TODO: dev only, delete otherwise
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(callback)
        .catch(errorCallback);
    }

    /**
     * Socket-io event emitters
     */
    join = (group_str_id: string) => this.socket.emit('join', group_str_id);
    leave = (group_str_id: string) => this.socket.emit('leave', group_str_id);
    delete = (group_str_id: string) => this.socket.emit('delete', group_str_id);
}
const api = new API();
export default api;