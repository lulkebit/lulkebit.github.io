import React from 'react';

const ComponentContainer = ({ children }) => {
    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 max-w-max mx-auto'>
                <div className='flex flex-col items-center space-y-6'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ComponentContainer;
