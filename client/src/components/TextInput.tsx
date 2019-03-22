import React, {useState} from 'react';
import InputWrapper from './InputWrapper';

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
        <InputWrapper
            className={className}
            label={label}
            name={name}
            active={active}
            valid={valid}
        >
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
        </InputWrapper>
    );
}

export default TextInput;