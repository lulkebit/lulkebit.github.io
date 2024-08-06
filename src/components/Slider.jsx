import React from 'react';
import NumberInput from './NumberInput';

const Slider = ({ label, min = 0, max = 60, value, onChange }) => {
    // Calculate the color based on the value
    const calculateColor = (value) => {
        const percentage = (value - min) / (max - min);
        const startColor = [147, 51, 234]; // RGB for purple-600
        const endColor = [102, 126, 234]; // RGB for indigo-600

        const r = Math.round(
            startColor[0] + percentage * (endColor[0] - startColor[0])
        );
        const g = Math.round(
            startColor[1] + percentage * (endColor[1] - startColor[1])
        );
        const b = Math.round(
            startColor[2] + percentage * (endColor[2] - startColor[2])
        );

        return `rgb(${r}, ${g}, ${b})`;
    };

    const thumbColor = calculateColor(value);

    return (
        <div className='flex items-center mb-4'>
            <label
                htmlFor={label.toLowerCase().replace(' ', '-')}
                className='flex-shrink-0 text-sm font-medium text-gray-700 mr-5'
            >
                {label}
            </label>
            <input
                type='number'
                id='number-input'
                min='0'
                max='60'
                value={value}
                onChange={onChange}
                className='w-15 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mr-4'
            />
            <div className='flex-grow'>
                <input
                    type='range'
                    id={label.toLowerCase().replace(' ', '-')}
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                    style={{
                        '--thumb-color': thumbColor,
                    }}
                />
            </div>
        </div>
    );
};

export default Slider;
