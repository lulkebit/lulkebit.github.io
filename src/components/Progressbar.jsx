import React from 'react';

function ProgressBar({ progress }) {
    const roundedProgress = Math.round(progress);

    return (
        <div className='flex flex-col items-center w-full max-w-md mx-auto'>
            <div className='w-full h-3 bg-white/20 rounded-full mb-2 relative overflow-hidden'>
                <div
                    className='absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-500 ease-out'
                    style={{ width: `${roundedProgress}%` }}
                >
                    <div className='absolute inset-0 bg-sparkasse-red/10'></div>
                </div>
            </div>
            <div className='flex items-center space-x-2'>
                <svg
                    className='w-4 h-4 text-white'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                >
                    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
                    <path d='M12 6v6l4 4' />
                </svg>
                <span className='text-white/90 font-medium'>
                    {roundedProgress}% abgeschlossen
                </span>
            </div>
        </div>
    );
}

export default ProgressBar;
