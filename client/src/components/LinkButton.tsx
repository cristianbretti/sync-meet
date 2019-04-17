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
                    'no-underline text-inherit p-2 block rounded bg-green-dark hover:bg-green-darker hover:shadow-inner shadow focus:outline-none'
                }
            >
                {text}
            </Link>
        </div>
    )
}

export default LinkButton
