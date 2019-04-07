import React, { Component } from 'react'
import { Time } from '../../api/models'

interface ScrollLoopProps {
    amount: number
    value: number
    setValue(chosenStr: string): void
}

export default class ScrollLoop extends Component<ScrollLoopProps> {
    private container: React.RefObject<HTMLDivElement>
    private childHeight: number = 0
    private scrollHeight: number = 0
    private disableScroll: boolean = false
    constructor(props: ScrollLoopProps) {
        super(props)
        this.container = React.createRef()
    }

    componentDidMount() {
        if (this.container.current) {
            if (this.props.value === 0) {
                this.container.current.children[
                    this.props.amount + 1
                ].scrollIntoView({ block: 'center' })
            } else {
                this.container.current.children[
                    this.props.value
                ].scrollIntoView({ block: 'center' })
            }
            this.childHeight = this.container.current.children[1].clientHeight
            this.scrollHeight = this.container.current.scrollHeight
        }
    }

    handleScroll = () => {
        if (!this.container.current) {
            return
        }

        if (!this.disableScroll) {
            if (
                this.container.current.scrollTop >=
                this.scrollHeight - 2 * this.childHeight - 2
            ) {
                this.container.current.scrollTop = 1
                this.disableScroll = true
            } else if (this.container.current.scrollTop <= 0) {
                const newVal = this.scrollHeight - 2.0 * this.childHeight - 2
                this.container.current.scrollTop = newVal
                this.disableScroll = true
            }
        } else {
            setTimeout(() => {
                this.disableScroll = false
            }, 40)
        }

        const chosen =
            Math.round(
                (this.container.current.scrollTop - 8) / this.childHeight + 1
            ) % this.props.amount
        const chosenStr = chosen < 10 ? '0' + chosen : '' + chosen
        this.props.setValue(chosenStr)
    }

    render() {
        return (
            <div
                ref={this.container}
                className="h-full overflow-y-auto invisible-scrollbar flex-1 flex flex-col items-center scroll-snap cursor-default"
                onScroll={this.handleScroll}
            >
                {Array.from(new Array(this.props.amount)).map((v, idx) => (
                    <div className={idx !== 0 ? 'snap-point' : ''} key={idx}>
                        {idx < 10 ? '0' + idx : idx}
                    </div>
                ))}
                <div className="snap-point">00</div>
                <div className="">01</div>
            </div>
        )
    }
}
