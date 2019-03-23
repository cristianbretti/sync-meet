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
    const [changed, setChanged] = useState(false);
    return (
        <InputWrapper
            className={className}
            label={label}
            name={name}
            active={active}
            valid={valid}
            changed={changed}
        >
            <input className="bg-inherit py-2 text-inherit outline-none" 
                type="text" 
                name={name} 
                value={value} 
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setChanged(true);
                    setValid(event.target.value !== "");
                    onChange(event.target.name, event.target.value)}
                }
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                onKeyDown={e => {
                    // Make Enter act like tab
                    const e2 = e as any;
                    if (e.keyCode === 13) {
                        const form = e2.target.form;
                        const index = Array.prototype.indexOf.call(form, e2.target);
                        form.elements[index + 1].focus();
                        e2.preventDefault();
                    }
                }}
            />
        </InputWrapper>
    );
}

export default TextInput;