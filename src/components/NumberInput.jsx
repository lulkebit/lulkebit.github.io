import React from 'react';

const NumberInput = ({ value, onChange }) => {
    return (
        <div className='flex items-center mb-4'>
            <div className='flex-grow'>
                <input
                    type='number'
                    id='number-input'
                    min='0'
                    max='60'
                    value={value}
                    onChange={onChange}
                    className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
            </div>
        </div>
    );
};

export default NumberInput;
