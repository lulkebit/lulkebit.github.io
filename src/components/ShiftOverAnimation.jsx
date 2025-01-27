import React, { useEffect } from 'react';
import '../css/ShiftOverAnimation.css';

const ShiftOverAnimation = () => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className='fixed inset-0 bg-gradient-to-b from-sparkasse-red to-sparkasse-darkred flex flex-col items-center justify-center p-4 overflow-hidden'>
            {/* Hintergrund-Dekoration */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2'></div>
                <div className='absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full translate-x-1/2 translate-y-1/2'></div>
            </div>

            {/* Konfetti-Animation */}
            <div className='confetti-container'>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className='confetti'
                        style={{
                            '--delay': `${Math.random() * 3}s`,
                            '--x-end': `${-50 + Math.random() * 100}vw`,
                            '--rotation': `${Math.random() * 720}deg`,
                            left: `${Math.random() * 100}vw`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Hauptinhalt */}
            <div className='relative z-10 text-center'>
                <h1 className='text-white text-5xl md:text-6xl font-bold mb-6 animate-scale-up'>
                    Feierabend!
                </h1>
                <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto animate-fade-up'>
                    <p className='text-white/90 text-xl md:text-2xl leading-relaxed'>
                        Dein Arbeitstag ist geschafft!
                        <br />
                        <span className='text-white/75 text-lg md:text-xl mt-2 block'>
                            Genieße deinen wohlverdienten Feierabend.
                        </span>
                    </p>
                </div>
            </div>

            {/* Sparkassen-Logo Animation */}
            <div
                className='absolute bottom-8 animate-fade-up'
                style={{ animationDelay: '1s' }}
            >
                <svg
                    className='w-12 h-12 text-white/40'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                >
                    <path d='M12 2L2 12h3v8h14v-8h3L12 2z' />
                </svg>
            </div>
        </div>
    );
};

export default ShiftOverAnimation;
