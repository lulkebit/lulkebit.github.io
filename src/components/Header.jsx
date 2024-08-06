import React from 'react';

const Header = () => {
    return (
        <header className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 px-4 shadow-lg'>
            <div className='container mx-auto'>
                <h1 className='text-4xl md:text-5xl font-bold text-center'>
                    Feierabendrechner
                </h1>
                <p className='text-xl mt-2 text-center font-light'>
                    Plane deinen Feierabend smart
                </p>
            </div>
        </header>
    );
};

export default Header;
