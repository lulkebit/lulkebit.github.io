import React from 'react';

const TimeInput = ({ label, value, onChange, enabled = true }) => {
    return (
        <div className='flex items-center justify-between gap-4 group p-2 rounded-lg hover:bg-sparkasse-red/5 transition-colors'>
            <label
                htmlFor={label.toLowerCase().replace(' ', '-')}
                className='text-sparkasse-gray/90 font-medium text-sm tracking-wide whitespace-nowrap group-hover:text-sparkasse-gray transition-colors'
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
                        w-32 px-3 py-2
                        bg-white border-2
                        ${
                            enabled
                                ? 'border-sparkasse-gray/15 group-hover:border-sparkasse-red/30'
                                : 'border-sparkasse-gray/5'
                        } 
                        rounded-lg
                        focus:outline-none focus:border-sparkasse-red focus:ring-2 focus:ring-sparkasse-red/20
                        ${
                            enabled
                                ? 'text-sparkasse-gray'
                                : 'text-sparkasse-gray/40 bg-sparkasse-lightgray'
                        }
                        transition-all duration-200 ease-in-out
                        text-base font-medium tracking-wide
                        appearance-none
                        shadow-sm
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
