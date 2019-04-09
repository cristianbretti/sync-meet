import React, { useEffect, useState } from 'react'
const STEP_TIME = 100
const INCREASE_RATE = 3
const INCREASE_BASE = 0.5
let timer: NodeJS.Timer

const SpinningModal: React.FC = () => {
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
        <div>
            <div className="absolute flex items-center justify-center pin bg-grey-darkest opacity-50 z-10" />
            <div className="absolute flex flex-col items-center justify-center pin z-20 ">
                <div className="flex flex-col items-center bg-grey-darker rounded shadow p-16 mx-8">
                    <div className="text-white pb-4">{percentDecimal}%</div>
                    <div className="w-64 h-8 bg-white">
                        <div
                            className="h-8 bg-green"
                            style={{ width: percentDecimal + '%' }}
                        />
                    </div>

                    <div className="text-white pt-4">{text}</div>
                </div>
            </div>
        </div>
    )
}

export default SpinningModal
