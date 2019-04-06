import React, { FC, useState, useRef, useEffect } from 'react'
import { Time } from '../../api/models'
import InputWrapper from '../InputWrapper'
import TimeModal from './TimeModal'
import { number } from 'prop-types'

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

    const handleHourScroll = (event: any) => {
        event.persist()
        const childHeight = event.target.children[1].clientHeight
        const chosen = Math.round((event.target.scrollTop - 8) / childHeight)
        const chosenStr = chosen < 10 ? '0' + chosen : chosen
        setCurrentValue(chosenStr + ':' + currentValue.substr(3, 2))
    }

    const handleMinScroll = (event: any) => {
        event.persist()
        const childHeight = event.target.children[1].clientHeight
        const chosen = Math.round((event.target.scrollTop - 8) / childHeight)
        const chosenStr = chosen < 10 ? '0' + chosen : chosen
        setCurrentValue(currentValue.substr(0, 3) + chosenStr)
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
                        className="absolute pin-t pin-x mt-10 w-2/3 z-10 border border-white rounded flex h-10"
                        onMouseEnter={() => setInside(true)}
                        onMouseLeave={() => setInside(false)}
                        onClick={(e: any) =>
                            e.currentTarget.parentElement.firstChild.focus()
                        }
                    >
                        <div
                            className="h-full overflow-y-auto invisible-scrollbar flex-1 flex flex-col items-center scroll-snap cursor-default"
                            onScroll={handleHourScroll}
                        >
                            {Array.from(new Array(24)).map((v, idx) => (
                                <div className="snap-point" key={idx}>
                                    {idx < 10 ? '0' + idx : idx}
                                </div>
                            ))}
                            <div className="snap-point">00</div>
                            <div className="snap-point">01</div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="mb-px pb-px">:</div>
                        </div>
                        <div
                            className="h-full overflow-y-auto invisible-scrollbar flex-1 flex flex-col items-center scroll-snap cursor-default"
                            onScroll={handleMinScroll}
                        >
                            <div className="invisible h-3">filler</div>
                            {Array.from(new Array(60)).map((v, idx) => (
                                <div className="snap-point" key={idx}>
                                    {idx < 10 ? '0' + idx : idx}
                                </div>
                            ))}
                            <div className="invisible h-3">filler</div>
                        </div>
                        <div className="flex flex-col items-center justify-center pr-1">
                            <i
                                className="mb-px material-icons text-sm cursor-pointer hover:bg-white rounded hover:text-grey-darkest hover:border border-white"
                                onClick={e => {
                                    e.stopPropagation()
                                    handleKeyDown(27)
                                }}
                            >
                                cancel
                            </i>
                            <i
                                className="mt-px material-icons text-sm cursor-pointer hover:bg-white rounded hover:text-grey-darkest hover:border border-white"
                                onClick={e => {
                                    e.stopPropagation()
                                    handleKeyDown(13)
                                }}
                            >
                                done
                            </i>
                        </div>
                    </div>
                ) : null}
            </div>
        </InputWrapper>
    )
}

export default TimeInput
