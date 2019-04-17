import React, { useEffect, useState } from 'react'
const STEP_TIME = 100
const INCREASE_RATE = 3
const INCREASE_BASE = 0.5
let timer: NodeJS.Timer

const SpinnerComponent: React.FC = () => {
    const [percentDecimal, setPercentDecimal] = useState(1)

    useEffect(() => {
        timer = setInterval(increasePercent, STEP_TIME)
        return () => {
            clearInterval(timer)
        }
    }, [percentDecimal])

    const sinusIncrease = (current: number) => {
        return (
            INCREASE_BASE + INCREASE_RATE * Math.sin((Math.PI / 100) * current)
        )
    }

    const increasePercent = () => {
        if (percentDecimal >= 99) {
            clearInterval(timer)
            return
        }

        setPercentDecimal(
            Math.round(percentDecimal + sinusIncrease(percentDecimal))
        )
    }
    let text = ''
    if (percentDecimal < 30) {
        text = 'Fetching stuff...'
    } else if (percentDecimal > 30 && percentDecimal < 60) {
        text = 'Finding common times...'
    } else {
        text = 'Displaying free times...'
    }
    return (
        <div className="flex flex-col items-center bg-grey-darkest rounded shadow p-16 mx-8">
            <div className="text-white text-lg pb-8">{percentDecimal}%</div>
            <div className="w-64 h-8 bg-grey-darker rounded">
                <div
                    className="h-8 bg-green rounded"
                    style={{ width: percentDecimal + '%' }}
                />
            </div>

            {percentDecimal < 99 && (
                <div className="text-white text-lg pt-8">{text}</div>
            )}
            {percentDecimal >= 99 && <div className="loader" />}
        </div>
    )
}

export default SpinnerComponent
