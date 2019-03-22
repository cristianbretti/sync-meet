import React, {useState} from 'react';

interface TextInputProps {
    className?: string;
    label: string;
    name: string;
    value: string;
    onChange(name:string, value: string): void;
} 

const TextInput: React.FC<TextInputProps> = ({className, label, name, value, onChange}) => {
    const [active, setActive] = useState(false);
    const [valid, setValid] = useState(false);
    return (
        <div className={className}>
            <div className={"relative mt-2"}>
                <input className="bg-inherit py-2 text-inherit outline-none" 
                    type="text" 
                    name={name} 
                    value={value} 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setValid(event.target.value !== "");
                        onChange(event.target.name, event.target.value)}
                    }
                    onFocus={() => setActive(true)}
                    onBlur={() => setActive(false)}
                />
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

export default TextInput;