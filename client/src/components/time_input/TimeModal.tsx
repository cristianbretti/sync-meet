import React, {Component, RefObject} from 'react';
import { Time } from '../../api/models';
import ListItem from './ListItem';
import { render } from 'react-dom';
import { KeyPress, KeyPressStatus } from './TimeInput';
// import { registerLocale, setDefaultLocale } from "react-datepicker";
// import sv from 'date-fns/locale/sv';
// registerLocale('sv', sv);
// setDefaultLocale('sv');

interface TimeModalProps {
    currentValue: Time;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    onHourChange(value: number): void;
    onMinChange(value: number): void;
    keyPress: KeyPress;
    setKeyPress: React.Dispatch<React.SetStateAction<KeyPress>>;
    lastChanged: React.MutableRefObject<boolean>;
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

    componentWillReceiveProps(nextProps: TimeModalProps) {
        if (nextProps.keyPress.status === KeyPressStatus.UP) {
            if (!this.props.lastChanged.current) {
                let newHover = (this.state.hoverHour + 23) % 24;
                if (this.state.hoverHour === -1) {
                    newHover = (nextProps.currentValue.getHours() + 23) % 24;
                }
                this.setHoverHour(newHover)
            } else {
                let newHover = (this.state.hoverMin + 55) % 60;
                if (this.state.hoverMin === -1) {
                    newHover = (nextProps.currentValue.getMinutes() + 55) % 60;
                }
                this.setHoverMin(newHover)
            }
            this.props.setKeyPress({status: KeyPressStatus.STANDBY});
        } else if (nextProps.keyPress.status === KeyPressStatus.DOWN) {
            if (!this.props.lastChanged.current) {
                let newHover = (this.state.hoverHour + 1) % 24;
                if (this.state.hoverHour === -1) {
                    newHover = (nextProps.currentValue.getHours() + 1) % 24;
                }
                this.setHoverHour(newHover);
            } else {
                let newHover = (this.state.hoverMin + 5) % 60;
                if (this.state.hoverMin === -1) {
                    newHover = (nextProps.currentValue.getMinutes() + 5) % 60;
                }
                this.setHoverMin(newHover);
            }
            this.props.setKeyPress({status: KeyPressStatus.STANDBY});
        } else if (nextProps.keyPress.status === KeyPressStatus.WAITING) {
            if (!this.props.lastChanged.current) {
                let newValue = this.state.hoverHour;
                if (newValue === -1) {
                    newValue = this.props.currentValue.getHours();
                }
                this.props.setKeyPress({status: KeyPressStatus.SET, value: newValue})
                this.setHoverHour(-1);
            } else {
                let newValue = this.state.hoverMin;
                if (newValue === -1) {
                    newValue = this.props.currentValue.getMinutes();
                }
                this.props.setKeyPress({status: KeyPressStatus.SET, value: newValue})
                this.setHoverMin(-1);
            }
        } else if (nextProps.keyPress.status === KeyPressStatus.RIGHT) {
            this.setHoverHour(-1);
            this.setHoverMin(nextProps.currentValue.getMinutes());
        } else if (nextProps.keyPress.status === KeyPressStatus.LEFT) {
            this.setHoverHour(nextProps.currentValue.getHours());
            this.setHoverMin(-1);
        }
    }

    render() {
        const {setActive, currentValue, keyPress} = this.props;
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
                                    scrollToCenter={keyPress.status === KeyPressStatus.STANDBY}
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
                                    scrollToCenter={keyPress.status === KeyPressStatus.STANDBY}
                                    />);
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}