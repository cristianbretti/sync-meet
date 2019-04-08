import React, { FC, useState, useRef, useEffect } from 'react'
import { Time } from '../../api/models'
import InputWrapper from '../InputWrapper'
// import TimeModal from './TimeModal'
import { number } from 'prop-types'
import ScrollLoop from './ScrollLoop'

interface TimeInputProps {
    className?: string
    label: string
    name: string
    value: Time
    valid: boolean
    changed: boolean
    onChange(name: string, value: Time): void
}

const TimeInput: FC<TimeInputProps> = ({
    className,
    label,
    name,
    value,
    valid,
    changed,
    onChange,
}) => {
    const [currentValue, setCurrentValue] = useState(value.toString())
    const [active, setActive] = useState(false)
    const [inside, setInside] = useState(false)

    const handleKeyDown = (keyCode: number) => {
        switch (keyCode) {
            case 13:
            case 9:
                // Enter or Tab
                try {
                    const newTime = new Time(currentValue)
                    if (isNaN(newTime.getHours())) {
                        throw 'is nan'
                    }
                    onChange(name, newTime)
                    setCurrentValue(newTime.toString())
                } catch {
                    setCurrentValue(value.toString())
                }
                setActive(false)
                break
            case 27:
                // Escape
                setCurrentValue(value.toString())
                setActive(false)
                break
        }
    }

    return (
        <InputWrapper
            className={className}
            label={label}
            name={name}
            active={active}
            valid={valid}
            changed={changed}
        >
            <div className="relative">
                <input
                    type="text"
                    className="bg-inherit py-2 text-inherit outline-none"
                    readOnly={window.outerWidth < 700}
                    value={
                        active
                            ? currentValue.toString()
                            : !changed
                            ? ''
                            : value.toString()
                    }
                    onChange={e => setCurrentValue(e.target.value)}
                    onKeyDown={e => handleKeyDown(e.keyCode)}
                    onFocus={() => setActive(true)}
                    onClick={() => setActive(true)}
                    onBlur={() => !inside && setActive(false)}
                />
                {active ? (
                    <div
                        className="absolute pin-t pin-x mt-10 w-24 z-10 border border-white bg-grey-darkest rounded flex h-12"
                        onMouseEnter={() => setInside(true)}
                        onMouseLeave={() => setInside(false)}
                        onClick={(e: any) =>
                            e.currentTarget.parentElement.firstChild.focus()
                        }
                    >
                        <ScrollLoop
                            amount={24}
                            setValue={chosenStr => {
                                const newTime = new Time(
                                    chosenStr + ':' + currentValue.substr(3, 2)
                                )
                                setCurrentValue(newTime.toString())
                                onChange(name, newTime)
                            }}
                            value={value.getHours()}
                        />
                        <div className="flex flex-col items-center justify-center">
                            <div className="mb-px pb-px">:</div>
                        </div>
                        <ScrollLoop
                            amount={60}
                            setValue={chosenStr => {
                                const newTime = new Time(
                                    currentValue.substr(0, 2) + ':' + chosenStr
                                )
                                setCurrentValue(newTime.toString())
                                onChange(name, newTime)
                            }}
                            value={value.getMinutes()}
                        />
                        <div className="absolute pin-t pin-x h-3 bg-grey-darkest opacity-50 pointer-events-none" />
                        <div className="absolute pin-b pin-x h-3 bg-grey-darkest opacity-50 pointer-events-none" />
                    </div>
                ) : null}
            </div>
        </InputWrapper>
    )
}

export default TimeInput
