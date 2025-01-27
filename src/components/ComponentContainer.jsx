import React from 'react';

const ComponentContainer = ({ children }) => {
    return (
        <div>
            <div className='bg-white rounded-xl shadow-lg p-8 w-96 border-t-4 border-sparkasse-red relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sparkasse-red/5 to-transparent rounded-full transform translate-x-16 -translate-y-16'></div>
                <div className='absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-sparkasse-red/5 to-transparent rounded-full transform -translate-x-20 translate-y-20'></div>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sparkasse-red to-sparkasse-red/70'></div>
                <div className='relative z-10'>
                    <div className='flex flex-col items-stretch space-y-6'>
                        <h2 className='text-sparkasse-gray text-xl font-semibold mb-4'>
                            Arbeitszeit
                        </h2>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentContainer;
