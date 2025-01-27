import React from 'react';

const Header = ({ remainingTime }) => {
    return (
        <header className='bg-sparkasse-red text-white py-6 px-4 shadow-lg relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8'>
                <div className='w-full h-full bg-sparkasse-darkred rounded-full opacity-20'></div>
            </div>
            <div className='container mx-auto relative z-10'>
                <div className='flex items-center justify-center mb-4'>
                    <svg
                        className='w-8 h-8 mr-2'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                    >
                        <path d='M12 2L2 12h3v8h14v-8h3L12 2z' />
                    </svg>
                    <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
                        Feierabendrechner
                    </h1>
                </div>
                <div className='bg-white/10 rounded-lg py-3 px-6 backdrop-blur-sm max-w-xs mx-auto'>
                    <p className='text-center'>
                        <span className='text-sm uppercase tracking-wide opacity-90'>
                            Feierabend in
                        </span>
                        <br />
                        <span className='text-2xl font-mono font-bold'>
                            {remainingTime}
                        </span>
                    </p>
                </div>
            </div>
        </header>
    );
};

export default Header;
