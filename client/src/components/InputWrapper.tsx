import React, {useState} from 'react';

interface InputWrapperProps {
    className?: string;
    label: string;
    name: string;
    active: boolean;
    valid: boolean;
    changed: boolean;
} 

const InputWrapper: React.FC<InputWrapperProps> = ({className, label, name, active, valid, changed, children}) => {
    return (
        <div className={className}>
            <div className={"relative mt-2"}>
                {children}
                <label className={"absolute pin-x pin-b mb-2 cursor-auto pointer-events-none"  
                    + " " + (active
                        ? "text-xs mb-8 text-blue-dark"
                        : !changed
                            ? "" 
                            : valid 
                                ? "text-xs mb-8 text-green"
                                : "text-xs mb-8 text-red")}
                    htmlFor={name}
                    style={{
                        transition: ".25s ease all"
                    }}
                >{label}</label>
                <div className="w-full h-px rounded-lg bg-grey-light absolute pin-x pin-b"/>
                <div className={"w-0 h-px rounded-lg  absolute pin-x pin-b" 
                    + " "  + (active 
                        ? "w-full bg-blue-dark" 
                        : "")}
                    style={{
                        transition: ".25s ease all"
                    }}
                />
            </div>
        </div>
    );
}

export default InputWrapper;