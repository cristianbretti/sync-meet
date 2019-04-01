import React from 'react'
import syncmeet from '../../resources/images/syncmeet.png'

interface LogoProps {
    className?: string
}

const Logo: React.SFC<LogoProps> = ({ className }) => {
    return (
        <div className={className}>
            <img src={syncmeet} alt="logo" />
        </div>
    )
}

export default Logo
