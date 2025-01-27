import React from 'react';

const Slider = ({ label, min = 0, max = 60, value, onChange }) => {
    return (
        <div className='flex flex-col w-full'>
            <div className='flex justify-between items-center mb-2'>
                <label
                    htmlFor={label.toLowerCase().replace(' ', '-')}
                    className='text-sparkasse-gray font-medium text-sm tracking-wide'
                >
                    {label}
                </label>
                <div className='flex items-center bg-sparkasse-lightgray rounded-lg px-3 py-1'>
                    <input
                        type='number'
                        id='number-input'
                        min='0'
                        max='60'
                        value={value}
                        onChange={onChange}
                        className='w-16 bg-transparent border-none text-sparkasse-gray font-medium text-lg focus:outline-none text-right'
                    />
                    <span className='text-sparkasse-gray/60 text-sm ml-1'>
                        min
                    </span>
                </div>
            </div>
            <div className='relative h-8 flex items-center'>
                <div className='absolute w-full h-2 bg-sparkasse-red/10 rounded-full'></div>
                <div
                    className='absolute h-2 bg-sparkasse-red rounded-full'
                    style={{ width: `${(value / max) * 100}%` }}
                ></div>
                <input
                    type='range'
                    id={label.toLowerCase().replace(' ', '-')}
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    className='absolute w-full appearance-none bg-transparent cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-sparkasse-red
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:duration-150
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-webkit-slider-thumb]:hover:border-sparkasse-darkred
                        
                        [&::-moz-range-thumb]:w-5
                        [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:border-2
                        [&::-moz-range-thumb]:border-sparkasse-red
                        [&::-moz-range-thumb]:shadow-lg
                        [&::-moz-range-thumb]:cursor-pointer
                        [&::-moz-range-thumb]:transition-all
                        [&::-moz-range-thumb]:duration-150
                        [&::-moz-range-thumb]:hover:scale-110
                        [&::-moz-range-thumb]:hover:border-sparkasse-darkred'
                />
            </div>
        </div>
    );
};

export default Slider;
