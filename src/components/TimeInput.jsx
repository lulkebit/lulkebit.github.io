import React from 'react';

const TimeInput = ({ label, value, onChange, enabled = true }) => {
    return (
        <div className='flex items-center justify-between gap-3 group'>
            <label
                htmlFor={label.toLowerCase().replace(' ', '-')}
                className='text-sparkasse-gray/80 font-medium text-sm tracking-wide whitespace-nowrap group-hover:text-sparkasse-gray transition-colors'
            >
                {label}
            </label>
            <div className='relative'>
                <input
                    type='time'
                    id={label.toLowerCase().replace(' ', '-')}
                    value={value}
                    onChange={onChange}
                    disabled={!enabled}
                    className={`
                        w-28 px-2.5 py-1.5
                        bg-white border-2
                        ${
                            enabled
                                ? 'border-sparkasse-gray/10 group-hover:border-sparkasse-gray/20'
                                : 'border-sparkasse-gray/5'
                        } 
                        rounded-lg
                        focus:outline-none focus:border-sparkasse-red focus:ring-1 focus:ring-sparkasse-red/20
                        ${
                            enabled
                                ? 'text-sparkasse-gray'
                                : 'text-sparkasse-gray/40 bg-sparkasse-lightgray'
                        }
                        transition-all duration-200 ease-in-out
                        text-base font-medium tracking-wide
                        appearance-none
                    `}
                />
                {!enabled && (
                    <div className='absolute inset-0 bg-sparkasse-lightgray/50 rounded-lg cursor-not-allowed'></div>
                )}
            </div>
        </div>
    );
};

export default TimeInput;
