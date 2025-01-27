import React from 'react';

const mockData = [
    {
        datum: '2024-03-18',
        startZeit: '08:00',
        endZeit: '16:30',
        pausenZeit: '30',
        gesamtZeit: '8:00',
    },
    {
        datum: '2024-03-19',
        startZeit: '07:45',
        endZeit: '16:15',
        pausenZeit: '45',
        gesamtZeit: '7:45',
    },
    {
        datum: '2024-03-20',
        startZeit: '08:15',
        endZeit: '17:00',
        pausenZeit: '30',
        gesamtZeit: '8:15',
    },
];

const TimeBar = ({ startZeit, endZeit, pausenZeit }) => {
    const startMinutes =
        parseInt(startZeit.split(':')[0]) * 60 +
        parseInt(startZeit.split(':')[1]);
    const endMinutes =
        parseInt(endZeit.split(':')[0]) * 60 + parseInt(endZeit.split(':')[1]);
    const pause = parseInt(pausenZeit);

    const totalMinutes = endMinutes - startMinutes;
    const workMinutes = totalMinutes - pause;

    const workPercentage = (workMinutes / totalMinutes) * 100;
    const pausePercentage = (pause / totalMinutes) * 100;

    return (
        <div className='flex items-center space-x-2'>
            <span className='text-xs text-sparkasse-gray/70'>{startZeit}</span>
            <div className='flex-grow h-3 bg-sparkasse-gray/10 rounded-md overflow-hidden'>
                <div
                    className='h-full bg-sparkasse-red relative'
                    style={{ width: `${workPercentage}%` }}
                >
                    <div
                        className='absolute right-0 h-full bg-sparkasse-red/30'
                        style={{ width: `${pausePercentage}%` }}
                    />
                </div>
            </div>
            <span className='text-xs text-sparkasse-gray/70'>{endZeit}</span>
        </div>
    );
};

const WorkTimeTracker = () => {
    const totalArbeitszeit = mockData.reduce((acc, curr) => {
        const [hours, minutes] = curr.gesamtZeit.split(':').map(Number);
        return acc + hours + minutes / 60;
    }, 0);

    return (
        <div className='bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border-t-4 border-sparkasse-red w-96 m-8'>
            {/* Sparkassen-Design Elemente */}
            <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sparkasse-red/5 to-transparent rounded-full transform translate-x-12 -translate-y-12'></div>
            <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-sparkasse-red/5 to-transparent rounded-full transform -translate-x-16 translate-y-16'></div>
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sparkasse-red to-sparkasse-red/70'></div>

            <div className='relative z-10'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-lg font-semibold text-sparkasse-gray'>
                        Arbeitszeiterfassung
                    </h2>
                    <div className='text-right'>
                        <p className='text-xs text-sparkasse-gray/70'>Gesamt</p>
                        <p className='text-lg font-semibold text-sparkasse-red'>
                            {totalArbeitszeit.toFixed(1)}h
                        </p>
                    </div>
                </div>

                <div className='space-y-4'>
                    {mockData.map((eintrag, index) => (
                        <div
                            key={index}
                            className='bg-white p-4 rounded-lg border border-sparkasse-gray/10 hover:border-sparkasse-red/30 transition-colors duration-150'
                        >
                            <div className='flex justify-between items-center mb-2'>
                                <span className='text-sm text-sparkasse-gray font-medium'>
                                    {eintrag.datum}
                                </span>
                                <span className='text-sm text-sparkasse-red font-semibold'>
                                    {eintrag.gesamtZeit}h
                                </span>
                            </div>
                            <TimeBar
                                startZeit={eintrag.startZeit}
                                endZeit={eintrag.endZeit}
                                pausenZeit={eintrag.pausenZeit}
                            />
                            <div className='mt-3 flex justify-between text-xs text-sparkasse-gray/70'>
                                <span>Pause: {eintrag.pausenZeit} Min</span>
                                <div className='flex items-center space-x-2'>
                                    <div className='flex items-center space-x-1'>
                                        <div className='w-1.5 h-1.5 bg-sparkasse-red rounded-full'></div>
                                        <span>Arbeitszeit</span>
                                    </div>
                                    <div className='flex items-center space-x-1'>
                                        <div className='w-1.5 h-1.5 bg-sparkasse-red/30 rounded-full'></div>
                                        <span>Pause</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkTimeTracker;
