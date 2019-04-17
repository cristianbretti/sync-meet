import React, { Component } from 'react'
import { DBUser } from '../api/models'
import api from '../api/api'

interface ChatProps {
    users: DBUser[]
    your_id: number
    group_str_id: string
}

interface ChatState {
    messages: string[]
    input: string
}

export default class Chat extends Component<ChatProps, ChatState> {
    constructor(props: ChatProps) {
        super(props)
        this.state = { messages: [], input: '' }
    }

    componentDidMount() {
        api.setMessageEventCallback((msg: string) => {
            const newMessages = this.state.messages.concat(msg)
            this.setState({ messages: newMessages })
        })
    }

    render() {
        const { users, your_id, group_str_id } = this.props
        return (
            <div>
                {this.state.messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        api.send(this.state.input, group_str_id)
                        this.setState({ input: '' })
                    }}
                >
                    <input
                        type="text"
                        value={this.state.input}
                        onChange={e => this.setState({ input: e.target.value })}
                    />
                    <input type="submit" value="Send" />
                </form>
            </div>
        )
    }
}
