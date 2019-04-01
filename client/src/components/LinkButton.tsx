import React, { FC } from 'react'
import { Link } from 'react-router-dom'

interface LinkButtonProps {
    className?: string
    text: string
    to: string
}

const LinkButton: FC<LinkButtonProps> = ({ className, text, to }) => {
    return (
        <div className={className}>
            <Link
                to={to}
                className={
                    'no-underline text-inherit p-2 block rounded bg-green hover:bg-green-dark hover:shadow-inner shadow'
                }
            >
                {text}
            </Link>
        </div>
    )
}

export default LinkButton
