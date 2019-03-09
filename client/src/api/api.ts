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
        this.socket.on('message', (msg: String) => {
            console.log(msg);
        });
    }

    setReciveCallback = (callback: (msg: String) => void) => {
        this.socket.on('message', callback);
    }

    request = (endpoint: String, method: "GET"|"POST"|"PUT"|"DELETE", body: any, callback: (responsObj: any) => void, errorCallback?: (error: any) => void) => {
        //TODO: change to just '/api/' + endpoint
        fetch('http://localhost:5000/api/' + endpoint, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),

            credentials: 'include', // This is for dev only, user same-origin otherwise
            mode: "cors", // This is for dev only, delete in prod
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(callback)
        .catch(errorCallback);
    }

    /**
     * Socket-io event emitters
     */
    join = (group_str_id: String) => this.socket.emit('join', group_str_id);
    leave = (group_str_id: String) => this.socket.emit('leave', group_str_id);
    delete = (group_str_id: String) => this.socket.emit('delete', group_str_id);
}
const api = new API();
export default api;