import React, { type ChangeEvent } from "react";

export interface QuantityInputProps {
    value: number;
    onChange: (newValue: number) => void;
    min?: number;
    className?: string;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
    value,
    onChange,
    min = 0,
    className = "",
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value, 10);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    };

    return (
        <input
            type="number"
            min={min}
            value={value}
            onChange={handleChange}
            className={`${className} mx-2 w-12 text-center bg-transparent focus:outline-none`
            }
        />
    );
};