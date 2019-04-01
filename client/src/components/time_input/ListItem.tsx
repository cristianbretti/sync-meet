import React, { Component } from 'react'

interface ListItemProps {
    setHover: (value: number) => void
    handleChange: () => void
    idx: number
    hover: number
    current: number
    scrollToCenter: boolean
}

export default class ListItem extends Component<ListItemProps> {
    private container: React.RefObject<HTMLDivElement>
    constructor(props: ListItemProps) {
        super(props)
        this.container = React.createRef()
    }

    public scrollToView = (extra: number) => {
        if (this.container.current && this.container.current.parentElement) {
            const child = this.container.current
            const parent = this.container.current.parentElement
            let offset = child.offsetTop - extra
            if (this.props.idx !== 0) {
                // 40 for fixed header height
                offset -= 40
            }
            parent.scroll({ top: offset })
        }
    }

    componentDidMount() {
        if (this.props.current === this.props.idx) {
            this.scrollToView(80)
        }
    }

    componentWillReceiveProps(nextProps: ListItemProps) {
        if (nextProps.hover === this.props.idx && nextProps.scrollToCenter) {
            this.scrollToView(80)
        }
    }

    render() {
        const { setHover, handleChange, idx, hover, current } = this.props
        return (
            <div
                ref={this.container}
                className={
                    'cursor-pointer flex justify-center text-xs text-black bg-white' +
                    ' ' +
                    (idx === 0 ? 'pt-10' : '')
                }
                onMouseEnter={() => setHover(idx)}
                onMouseLeave={() => setHover(-1)}
                onClick={() => handleChange()}
            >
                <div
                    className={
                        'p-2 pointer-events-none rounded' +
                        ' ' +
                        (hover === idx
                            ? 'bg-blue-light '
                            : current === idx
                            ? 'bg-blue-dark text-white font-semibold'
                            : '')
                    }
                >
                    {idx > 9 ? idx : '0' + idx}
                </div>
            </div>
        )
    }
}
