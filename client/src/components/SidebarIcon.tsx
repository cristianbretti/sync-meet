import React, { FC, useState } from 'react'

interface SidebarIconProps {
    className?: string
    icon: string
    text: string
    invisible?: boolean
    onClick?(): void
}

const SidebarIcon: FC<SidebarIconProps> = ({
    className,
    icon,
    text,
    invisible,
    onClick,
}) => {
    const [hover, setHover] = useState(false)
    return (
        <div
            className={
                'relative flex justify-center items-center' + ' ' + className
            }
            onClick={onClick}
        >
            <i
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={
                    'material-icons px-1 text-sm' +
                    ' ' +
                    (invisible ? 'invisible' : ' ')
                }
            >
                {icon}
            </i>
            <div
                className={
                    'absolute pin-b pin-r mr-6 pointer-events-none  z-10 bg-grey p-2 rounded-sm text-xs shadow-md min-w-32 text-white'
                }
                style={{
                    transition: '.25s ease all',
                    transitionDelay: '.1s',
                    transformOrigin: 'right center',
                    transform: hover ? 'scale(1)' : 'scale(0)',
                }}
            >
                {text}
            </div>
        </div>
    )
}

export default SidebarIcon
