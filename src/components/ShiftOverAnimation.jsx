import React from 'react';
import '../css/ShiftOverAnimation.css';

const ShiftOverAnimation = () => {
    return (
        <div className='shift-over-container'>
            <h1 className='shift-over-text text-blue-500'>Feierabend!</h1>
            <p className='shift-over-subtext'>
                Dein regulärer Arbeitstag ist geschafft. Komm gut nach hause!
            </p>
            <div className='fireworks'>
                <div className='firework'></div>
                <div className='firework'></div>
                <div className='firework'></div>
            </div>
        </div>
    );
};

export default ShiftOverAnimation;
