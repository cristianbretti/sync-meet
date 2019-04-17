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
        this.state = { messages: [], input: '', users: {} }
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
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>{users[msg.id] + ': ' + msg.message}</div>
                ))}
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        api.send(input, your_id, group_str_id)
                        this.setState({ input: '' })
                    }}
                >
                    <input
                        type="text"
                        value={input}
                        onChange={e => this.setState({ input: e.target.value })}
                    />
                    <input type="submit" value="Send" />
                </form>
            </div>
        )
    }
}
