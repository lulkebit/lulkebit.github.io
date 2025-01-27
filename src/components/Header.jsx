import React from 'react';
import ProgressBar from './Progressbar';

const Header = ({ remainingTime, progress }) => {
    return (
        <header className='bg-sparkasse-red text-white py-4 px-4 shadow-lg relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-24 h-24 transform translate-x-12 -translate-y-8'>
                <div className='w-full h-full bg-sparkasse-darkred rounded-full opacity-20'></div>
            </div>
            <div className='container mx-auto relative z-10'>
                <div className='flex items-center justify-center mb-3'>
                    <svg
                        className='w-6 h-6 mr-2'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                    >
                        <path d='M12 2L2 12h3v8h14v-8h3L12 2z' />
                    </svg>
                    <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
                        Feierabendrechner
                    </h1>
                </div>
                <div className='bg-white/10 rounded-lg py-2 px-4 backdrop-blur-sm max-w-xs mx-auto mb-3'>
                    <p className='text-center'>
                        <span className='text-sm uppercase tracking-wide opacity-90'>
                            Feierabend in
                        </span>
                        <br />
                        <span className='text-xl font-mono font-bold'>
                            {remainingTime}
                        </span>
                    </p>
                </div>
                <div className='max-w-md mx-auto'>
                    <ProgressBar progress={progress} />
                </div>
            </div>
        </header>
    );
};

export default Header;
