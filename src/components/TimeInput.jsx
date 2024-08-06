import React from 'react';

const TimeInput = ({ label, value, onChange, enabled = true }) => {
    return (
        <div className='flex items-center mb-4'>
            <label
                htmlFor={label.toLowerCase().replace(' ', '-')}
                className='flex-shrink-0 mr-3 text-sm font-medium text-gray-700 w-24'
            >
                {label}
            </label>
            <div className='flex-grow'>
                <input
                    type='time'
                    id={label.toLowerCase().replace(' ', '-')}
                    value={value}
                    onChange={onChange}
                    disabled={!enabled}
                    className={`
            w-30 px-3 py-2 
            bg-white border ${enabled ? 'border-gray-300' : 'border-gray-200'} 
            rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            ${enabled ? 'text-gray-700' : 'text-gray-500 bg-gray-50'}
            ${enabled ? 'hover:border-gray-400' : ''}
            transition duration-150 ease-in-out
          `}
                />
            </div>
        </div>
    );
};

export default TimeInput;
