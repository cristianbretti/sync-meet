import React, { Component } from 'react'
import { Time } from '../../api/models'

interface ScrollLoopProps {
    amount: number
    value: number
}

export default class ScrollLoop extends Component<ScrollLoopProps> {
    private container: React.RefObject<HTMLDivElement>
    constructor(props: ScrollLoopProps) {
        super(props)
        this.container = React.createRef()
    }

    componentDidMount() {
        if (this.container.current) {
            this.container.current.children[this.props.value].scrollIntoView()
        }
    }

    handleHourScroll = (event: any) => {
        event.persist()
        const childHeight = event.target.children[1].clientHeight
        const chosen = Math.round((event.target.scrollTop - 8) / childHeight)
        const chosenStr = chosen < 10 ? '0' + chosen : chosen
        console.log(chosenStr)
    }

    render() {
        return (
            <div
                ref={this.container}
                className="h-full overflow-y-auto invisible-scrollbar flex-1 flex flex-col items-center scroll-snap cursor-default"
                onScroll={this.handleHourScroll}
            >
                {Array.from(new Array(this.props.amount)).map((v, idx) => (
                    <div className="snap-point" key={idx}>
                        {idx < 10 ? '0' + idx : idx}
                    </div>
                ))}
                <div className="snap-point">00</div>
                <div className="snap-point">01</div>
            </div>
        )
    }
}
