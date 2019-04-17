import React, { useEffect, useState } from 'react'
import SpinnerComponent from '../components/SpinnerComponent'

const SpinningModal: React.FC = () => {
    return (
        <div>
            <div className="absolute flex items-center justify-center pin bg-grey-darkest opacity-50 z-10" />
            <div className="absolute flex flex-col items-center justify-center pin z-20 ">
                <SpinnerComponent />
            </div>
        </div>
    )
}

export default SpinningModal
