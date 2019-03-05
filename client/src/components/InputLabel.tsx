import React from 'react';

interface InputLabelProps {
    text: string,
} 

export const InputLabel:React.FC<InputLabelProps> = (props) => {

    return (
        <div className="pt-5 pb-2 text-white uppercase text-xl">
            {props.text}
        </div>
    );
}