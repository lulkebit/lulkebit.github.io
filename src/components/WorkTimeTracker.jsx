import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimeBar = ({ startZeit, endZeit, pausenZeit, isPrognose = false }) => {
    // Überprüfe, ob die Zeiten gültig sind
    if (
        !startZeit ||
        !endZeit ||
        startZeit === '00:00' ||
        endZeit === '00:00'
    ) {
        return (
            <div className='flex items-center space-x-2'>
                <span className='text-xs text-sparkasse-gray/70'>
                    {startZeit || '00:00'}
                </span>
                <div className='flex-grow h-3 bg-sparkasse-gray/10 rounded-md'></div>
                <span className='text-xs text-sparkasse-gray/70'>
                    {endZeit || '00:00'}
                </span>
            </div>
        );
    }

    const startMinutes =
        parseInt(startZeit.split(':')[0]) * 60 +
        parseInt(startZeit.split(':')[1]);
    const endMinutes =
        parseInt(endZeit.split(':')[0]) * 60 + parseInt(endZeit.split(':')[1]);
    const pause = parseInt(pausenZeit) || 0;

    // Behandle den Fall, wenn die Endzeit vor der Startzeit liegt
    let totalMinutes =
        endMinutes >= startMinutes
            ? endMinutes - startMinutes
            : 24 * 60 - startMinutes + endMinutes;

    const workMinutes = Math.max(0, totalMinutes - pause);

    // Berechne die Prozentsätze nur wenn totalMinutes > 0
    const workPercentage =
        totalMinutes > 0 ? (workMinutes / totalMinutes) * 100 : 0;
    const pausePercentage = totalMinutes > 0 ? (pause / totalMinutes) * 100 : 0;

    return (
        <div className='flex items-center space-x-2'>
            <span className='text-xs text-sparkasse-gray/70'>{startZeit}</span>
            <div className='flex-grow h-3 bg-sparkasse-gray/10 rounded-md overflow-hidden'>
                <div className='flex h-full'>
                    <div
                        className={`h-full ${
                            isPrognose
                                ? 'bg-sparkasse-red/50'
                                : 'bg-sparkasse-red'
                        }`}
                        style={{ width: `${workPercentage}%` }}
                    />
                    <div
                        className={`h-full ${
                            isPrognose ? 'bg-yellow-400/50' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${pausePercentage}%` }}
                    />
                </div>
            </div>
            <span className='text-xs text-sparkasse-gray/70'>{endZeit}</span>
        </div>
    );
};

const WorkTimeTracker = ({ refreshTrigger = 0 }) => {
    const [arbeitszeiten, setArbeitszeiten] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArbeitszeiten = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/arbeitszeiten'
                );

                const today = new Date().toISOString().split('T')[0];
                const now = new Date();

                // Sortiere die Einträge und markiere den heutigen als Prognose
                const sortedArbeitszeiten = response.data
                    .map((entry) => {
                        if (entry.datum === today) {
                            // Konvertiere die Endzeit in ein Date-Objekt für heute
                            const [endHours, endMinutes] = entry.endZeit
                                .split(':')
                                .map(Number);
                            const endDate = new Date(now);
                            endDate.setHours(endHours, endMinutes, 0, 0);

                            // Wenn die Endzeit in der Zukunft liegt, ist es eine Prognose
                            const isPrognostic = endDate > now;

                            // Formatiere die Gesamtzeit korrekt
                            const gesamtZeit = entry.gesamtZeit || '00:00';
                            return {
                                ...entry,
                                isPrognose: isPrognostic,
                                gesamtZeit: gesamtZeit.includes(':')
                                    ? gesamtZeit
                                    : `${gesamtZeit}:00`,
                            };
                        }
                        return entry;
                    })
                    .sort((a, b) => new Date(b.datum) - new Date(a.datum));

                setArbeitszeiten(sortedArbeitszeiten);
                setLoading(false);
            } catch (err) {
                setError('Fehler beim Laden der Arbeitszeiten');
                setLoading(false);
            }
        };

        fetchArbeitszeiten();
    }, [refreshTrigger]);

    const totalArbeitszeit = arbeitszeiten
        .filter((entry) => !entry.isPrognose) // Nur abgeschlossene Tage für die Gesamtzeit
        .reduce((acc, curr) => {
            const [hours, minutes] = curr.gesamtZeit.split(':').map(Number);
            return acc + hours + minutes / 60;
        }, 0);

    if (loading) {
        return (
            <div className='bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border-t-4 border-sparkasse-red w-96 m-8'>
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sparkasse-red'></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border-t-4 border-sparkasse-red w-96 m-8'>
                <div className='flex justify-center items-center h-64'>
                    <p className='text-sparkasse-red'>{error}</p>
                </div>
            </div>
        );
    }

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
                    {arbeitszeiten.map((eintrag) => (
                        <div
                            key={eintrag._id}
                            className={`bg-white p-4 rounded-lg border ${
                                eintrag.isPrognose
                                    ? 'border-sparkasse-red/20 bg-sparkasse-red/5'
                                    : 'border-sparkasse-gray/10 hover:border-sparkasse-red/30'
                            } transition-colors duration-150`}
                        >
                            <div className='flex justify-between items-center mb-2'>
                                <div className='flex items-center space-x-2'>
                                    <span className='text-sm text-sparkasse-gray font-medium'>
                                        {eintrag.datum}
                                    </span>
                                    {eintrag.isPrognose && (
                                        <span className='text-xs text-sparkasse-red/70 font-medium px-2 py-0.5 bg-sparkasse-red/10 rounded-full'>
                                            Prognose
                                        </span>
                                    )}
                                </div>
                                <span className='text-sm text-sparkasse-red font-semibold'>
                                    {eintrag.gesamtZeit}h
                                </span>
                            </div>
                            <TimeBar
                                startZeit={eintrag.startZeit}
                                endZeit={eintrag.endZeit}
                                pausenZeit={eintrag.pausenZeit}
                                isPrognose={eintrag.isPrognose}
                            />
                            <div className='mt-3 flex justify-between text-xs text-sparkasse-gray/70'>
                                <span>Pause: {eintrag.pausenZeit} Min</span>
                                <div className='flex items-center space-x-2'>
                                    <div className='flex items-center space-x-1'>
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                eintrag.isPrognose
                                                    ? 'bg-sparkasse-red/50'
                                                    : 'bg-sparkasse-red'
                                            }`}
                                        ></div>
                                        <span>Arbeitszeit</span>
                                    </div>
                                    <div className='flex items-center space-x-1'>
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                eintrag.isPrognose
                                                    ? 'bg-yellow-400/50'
                                                    : 'bg-yellow-400'
                                            }`}
                                        ></div>
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
