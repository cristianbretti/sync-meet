import React, {useState} from 'react';

interface InputWrapperProps {
    className?: string;
    label: string;
    name: string;
    active: boolean;
    valid: boolean;
} 

const InputWrapper: React.FC<InputWrapperProps> = ({className, label, name, active, valid, children}) => {
    return (
        <div className={className}>
            <div className={"relative mt-2"}>
                {children}
                <label className={"absolute pin-x pin-b mb-2 cursor-auto pointer-events-none"  + " " + (active || valid ? "text-xs mb-8 text-green" : "")}
                    htmlFor={name}
                    style={{
                        transition: ".25s ease all"
                    }}
                >{label}</label>
                <div className="w-full h-px rounded-lg bg-grey-light absolute pin-x pin-b"/>
                <div className={"w-0 h-px rounded-lg bg-green absolute pin-x pin-b" + " "  + (active ? "w-full" : "") }
                    style={{
                        transition: ".25s ease all"
                    }}
                />
            </div>
        </div>
    );
}

export default InputWrapper;