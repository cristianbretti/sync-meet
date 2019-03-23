import React, {Component} from 'react';

interface ListItemProps {
    setHover:(value:number) => void;
    handleChange:() => void;
    idx:number;
    hover: number; 
    current: number;
}

export default class ListItem extends Component<ListItemProps> {
    constructor(props: ListItemProps) {
        super(props);
    }

    render() {
        const {setHover, handleChange, idx, hover, current} = this.props;
        return (
        <div 
            className={"cursor-pointer flex justify-center text-xs text-black bg-white"
                + " " + (idx === 0 ? "pt-10": "")
                + " " + (idx === current ? "scroll-top" : "")}
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(-1)}
            onClick={() => handleChange()}
        >
            <div className={"p-2 pointer-events-none rounded"+ " " 
                + (hover === idx 
                    ? "bg-blue "
                    : current === idx
                        ? "bg-blue-dark"
                        : "")
            }>
                {idx > 9 ? idx : "0" + idx}
            </div>
        </div>)
    }
}