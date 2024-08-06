import React from 'react';

const Header = () => {
    return (
        <header className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 px-4 shadow-lg'>
            <div className='container mx-auto'>
                <h1 className='text-4xl md:text-5xl font-bold text-center py-5'>
                    Feierabendrechner
                </h1>
            </div>
        </header>
    );
};

export default Header;
