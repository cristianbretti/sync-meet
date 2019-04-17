import React, { Component } from 'react'
import { DBUser, SocketMessage } from '../api/models'
import api from '../api/api'

interface ChatProps {
    users: DBUser[]
    your_id: number
    group_str_id: string
}

interface ChatState {
    messages: SocketMessage[]
    input: string
    users: { [id: number]: string }
}

export default class Chat extends Component<ChatProps, ChatState> {
    constructor(props: ChatProps) {
        super(props)
        this.state = {
            messages: [],
            input: '',
            users: {},
        }
    }

    componentDidMount() {
        api.setMessageEventCallback((msg: SocketMessage) => {
            this.setState({ messages: this.state.messages.concat(msg) })
        })
    }

    componentWillReceiveProps(nextProps: ChatProps) {
        const users: { [id: number]: string } = {}
        nextProps.users.forEach(u => {
            if (u.id === nextProps.your_id) {
                users[u.id] = 'You'
            } else {
                users[u.id] = u.name
            }
        })
        this.setState({ users: users })
    }

    render() {
        const { your_id, group_str_id } = this.props
        const { users, messages, input } = this.state
        return (
            <div className="flex-1 flex flex-col bg-grey-dark rounded overflow-hidden">
                <div className="flex-1 flex flex-col overflow-y-scroll invisible-scrollbar px-1">
                    {messages.map((msg, idx) => {
                        console.log(msg)
                        if (msg.id === -1) {
                            //-1 if a user has joined
                            return (
                                <div className="m-1 text-grey-light text-xs leading-tight">
                                    {msg.message}
                                </div>
                            )
                        } else {
                            return (
                                <div className="m-1">
                                    {msg.id !== your_id && (
                                        <div className="text-grey-light text-xs leading-tight">
                                            {users[msg.id]}
                                        </div>
                                    )}

                                    <div
                                        className={
                                            'p-1  text-black rounded inline-flex' +
                                            ' ' +
                                            (msg.id === your_id
                                                ? 'bg-blue-light float-right'
                                                : 'bg-grey-lighter')
                                        }
                                        key={idx}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                <form
                    className="flex border border-grey p-1 rounded-b"
                    onSubmit={e => {
                        e.preventDefault()
                        api.send(input, your_id, group_str_id)
                        this.setState({ input: '' })
                    }}
                >
                    <input
                        className="flex-1 outline-none p-1 bg-grey-dark text-white"
                        type="text"
                        placeholder="Write a message..."
                        value={input}
                        onChange={e => this.setState({ input: e.target.value })}
                    />
                    <button className="outline-none" type="submit">
                        <i className="material-icons text-white text-xl px-2">
                            send
                        </i>
                    </button>
                </form>
            </div>
        )
    }
}
