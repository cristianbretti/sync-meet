import React, {Component, RefObject} from 'react';
import { Time } from '../../api/models';
import ListItem from './ListItem';
import { render } from 'react-dom';
// import { registerLocale, setDefaultLocale } from "react-datepicker";
// import sv from 'date-fns/locale/sv';
// registerLocale('sv', sv);
// setDefaultLocale('sv');

interface TimeModalProps {
    currentValue: Time;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    onHourChange(value: number): void;
    onMinChange(value: number): void;
}

interface TimeModalState {
    hoverHour: number;
    hoverMin: number;
}

export default class TimeModal extends Component<TimeModalProps, TimeModalState> {
    constructor(props: TimeModalProps) {
        super(props);
        this.state = {
            hoverHour: -1,
            hoverMin: -1,
        }
    }
    public setHoverHour = (value: number) => {this.setState({hoverHour: value})}
    public setHoverMin = (value: number) => {this.setState({hoverMin: value})}

    public handleChange = (newValue: number, hour: boolean) => {
        if (hour) {
            this.props.onHourChange(newValue);
        } else {
            this.props.onMinChange(newValue);
        }
    }

    render() {
        const {setActive, currentValue} = this.props;
        return (<div 
                className={"absolute pin-t pin-x mt-10 w-2/3 z-10  border border-white rounded"
                    + " " }
                onBlur={() => setActive(false)}
            >
            <div 
                className={"relative h-64 overflow-hidden"}
            >
                <div className={"absolute pin-x text-black font-bold flex justify-center py-2 border-grey bg-grey-lightest border-b border-grey-light"}
                >
                    <div className="flex-1 text-center">Hour</div><div className="text-center">:</div><div className="flex-1 text-center">Min</div>
                </div>
                <div className="flex h-full w-full">
                    <div className="flex-1 h-full">
                        <div className="h-full w-full overflow-y-scroll"
                            style={{
                                paddingRight: '17px',
                                boxSizing: 'content-box'
                            }}
                        >
                            {Array.from(Array(24)).map((v, idx) => {
                                return (<ListItem
                                    key={idx}
                                    setHover={this.setHoverHour}
                                    handleChange={() => this.handleChange(idx, true)}
                                    idx={idx}
                                    hover={this.state.hoverHour}
                                    current={currentValue.getHours()}
                                    />);
                            })}
                        </div>
                    </div>
                    <div className="flex-1 h-full">
                        <div className="w-full h-full overflow-y-scroll border-l border-grey"
                            style={{
                                paddingRight: '17px',
                                boxSizing: 'content-box'
                            }}
                        >
                            {Array.from(Array(60)).map((v, idx) => {
                                if (idx % 5 !== 0) {
                                    return null;
                                } 
                                return (<ListItem
                                    key={idx}
                                    setHover={this.setHoverMin}
                                    handleChange={() => this.handleChange(idx, false)}
                                    idx={idx}
                                    hover={this.state.hoverMin}
                                    current={currentValue.getMinutes()}
                                    />);
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}