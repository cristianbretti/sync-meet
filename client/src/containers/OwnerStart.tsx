    import React, { Component } from 'react';
    import logo from '../logo.svg';
    import '../App.css';
    import GoogleLogin from 'react-google-login';
    import io from 'socket.io-client';

class OwnerStart extends Component {
    socket: null | SocketIOClient.Socket = null; 
    componentDidMount() {
        this.socket = io.connect('http://localhost:5000');
        console.log(this.socket);

        this.socket.on('message', (msg: String) => {
            console.log(msg);
        });
    }

    componentWillUnmount() {
        this.socket && this.socket.disconnect();
    }

    render() {
        return (
        <div className="text-center">
            <header className="App-header bg-blue">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Edit <code>src/App.tsx</code> and save to relo
            </p>
            <GoogleLogin
                clientId="486151037791-q5avgjf6pc73d39v1uaalta9h3i0ha2d.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                scope={'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'}
            />
            <button onClick={() => {
                let data = {
                    group_name:"test_group",
                    from_date:"2019-03-20",
                    to_date:"2020-01-20",
                    from_time:"10:00",
                    to_time:"10:01",
                    meeting_length:"01:00",
                    user_name:"test_user",
                    access_token:"ya29.GmW-Bs99VahhfFBdQ36qCZnNW7a7UbFXEivh1WCYUeEVvOJh2LSvXGeQHrAHkNgzGTPExDULcc3hrIWPjYMNs8snQWJKIkSFbG4s5DCAp2rG1wotbD7w8ZaAEX5yc00OiOVUTFk3AQ",
                    id_token:"eyJhbGciOiJSUzI1NiIsImtpZCI6ImNmMDIyYTQ5ZTk3ODYxNDhhZDBlMzc5Y2M4NTQ4NDRlMzZjM2VkYzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDg2MTUxMDM3NzkxLXE1YXZnamY2cGM3M2QzOXYxdWFhbHRhOWgzaTBoYTJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDg2MTUxMDM3NzkxLXE1YXZnamY2cGM3M2QzOXYxdWFhbHRhOWgzaTBoYTJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE3ODMyMDczMTM1OTMyNjcwMTI4IiwiZW1haWwiOiJhbnRvbnN0YWdnZTk1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiY3E3UkoxNXlSVW9YekhvWl9pVUQ4dyIsIm5hbWUiOiJBbnRvbiBTdGFnZ2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy03VFpGNmRXVkZoZy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JkRkFnd3FxeFV6TGhVLUQyQWhlNzdUVUc5NTRRL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJBbnRvbiIsImZhbWlseV9uYW1lIjoiU3RhZ2dlIiwibG9jYWxlIjoic3YiLCJpYXQiOjE1NTIxMzY5MjMsImV4cCI6MTU1MjE0MDUyMywianRpIjoiMjMzOTkzYjk4MGMxNjI4NGM0ZTcxZDhhYTI1ZjI5ZWZhY2MyOTUzYiJ9.Uy-xmVhDsQaIvIdoFGjAjNIoegluYqdBgJErudgO7H3MDv5zeHI4MAQZIDU5a-w6N7tITeq9RklpQPGm0rPZOF5Z6qlrxucZvompk8cbQJHjPSttOCyFcMoNiMoegeRHnTBIECS7GYp4hssTBUOXsS0y6vCY08vazc33LNgWMFIiaHN1KAa8waC69WV_efV3ChQjUJQv4r5fflpcKikbT48MZP7RLLvxW0Dmv-THzpMRymKgYMOgrk5ZvrKuec9xsUoUtI1Kj0abKSfs7Qtqzb1GZDdGoAQuLmwfxmUhPVE52YDPnctIXdeKwfQl8Y4MT7C-ntDhcnGx5YwHUiQbVQ"
                }

                fetch('http://localhost:5000/api/creategroup', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    
                    credentials: 'include', // This is for dev only, user same-origin otherwise
                    mode: "cors",

                    body: JSON.stringify(data)
                }).then((response) => {
                    return response.json();
                }).then((myJson) => {
                    console.log(JSON.stringify(myJson));
                });


            }} >Connect!</button>
            <button
                onClick={() => {
                    fetch('http://localhost:5000/api/test', {
                        method: "POST",
                        credentials: 'include', // This is for dev only, user same-origin otherwise
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        mode: "cors",
                        body: JSON.stringify({test: "hello"}),
                    }).then((response) => {
                        return response.json();
                    }).then((myJson) => {
                        console.log(JSON.stringify(myJson));
                    });
                }}
            >TEST
            </button>

            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn React
            </a>
            </header>
        </div>
        );
    }
    }

    const responseGoogle = (response: any) => {
        console.log(response);
    }

export default OwnerStart;
