import React from 'react';

function ProgressBar({ progress }) {
    const roundedProgress = Math.round(progress);

    return (
        <div className='flex flex-col items-center'>
            <div className='w-1/2 bg-gray-200 rounded-full h-2.5 mb-2 relative'>
                <div
                    className='bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out'
                    style={{ width: `${roundedProgress}%` }}
                ></div>
            </div>
            <span className='text-black text-sm'>{roundedProgress}%</span>
        </div>
    );
}

export default ProgressBar;
