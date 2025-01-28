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
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;

    // Funktion zum Formatieren des Datums
    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    };

    useEffect(() => {
        fetchArbeitszeiten();
    }, [refreshTrigger]);

    const fetchArbeitszeiten = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'https://feierabendrechner-backend.vercel.app/api/arbeitszeiten',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const today = new Date().toISOString().split('T')[0];
            const now = new Date();

            const sortedArbeitszeiten = response.data
                .map((entry) => {
                    if (entry.datum === today) {
                        const [endHours, endMinutes] = entry.endZeit
                            .split(':')
                            .map(Number);
                        const endDate = new Date(now);
                        endDate.setHours(endHours, endMinutes, 0, 0);

                        const isPrognostic = endDate > now;

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
        } catch (error) {
            console.error('Fehler beim Laden der Arbeitszeiten:', error);
            setError('Fehler beim Laden der Arbeitszeiten');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.reload(); // Seite neu laden um Auth-Status zu aktualisieren
    };

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

    const totalPages = Math.ceil(arbeitszeiten.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = arbeitszeiten.slice(
        indexOfFirstEntry,
        indexOfLastEntry
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalArbeitszeit = arbeitszeiten
        .filter((entry) => !entry.isPrognose)
        .reduce((acc, curr) => {
            const [hours, minutes] = curr.gesamtZeit.split(':').map(Number);
            return acc + hours * 60 + minutes; // Konvertiere alles in Minuten
        }, 0);

    // Konvertiere die Gesamtminuten zurück in Stunden und Minuten
    const totalHours = Math.floor(totalArbeitszeit / 60);
    const totalMinutes = totalArbeitszeit % 60;
    const formattedTotal = `${String(totalHours).padStart(2, '0')}:${String(
        totalMinutes
    ).padStart(2, '0')}`;

    return (
        <div className='bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border-t-4 border-sparkasse-red w-96 m-8'>
            {/* Sparkassen-Design Elemente */}
            <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sparkasse-red/5 to-transparent rounded-full transform translate-x-12 -translate-y-12'></div>
            <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-sparkasse-red/5 to-transparent rounded-full transform -translate-x-16 translate-y-16'></div>
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sparkasse-red to-sparkasse-red/70'></div>

            <div className='relative z-10'>
                <div className='flex justify-between items-center mb-6'>
                    <div>
                        <h2 className='text-lg font-semibold text-sparkasse-gray'>
                            Arbeitszeiterfassung
                        </h2>
                        <p className='text-sm text-sparkasse-gray/70'>
                            {localStorage.getItem('username')}
                        </p>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <div className='text-right'>
                            <p className='text-xs text-sparkasse-gray/70'>
                                Gesamt
                            </p>
                            <p className='text-lg font-semibold text-sparkasse-red'>
                                {formattedTotal}h
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className='text-sparkasse-gray/70 hover:text-sparkasse-red'
                            title='Abmelden'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                                <polyline points='16 17 21 12 16 7' />
                                <line x1='21' y1='12' x2='9' y2='12' />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='space-y-4'>
                    {currentEntries.map((eintrag) => (
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
                                        {formatDate(eintrag.datum)}
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

                {/* Paginierung */}
                {totalPages > 1 && (
                    <div className='flex justify-center items-center mt-6 space-x-2'>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${
                                currentPage === 1
                                    ? 'text-sparkasse-gray/30 cursor-not-allowed'
                                    : 'text-sparkasse-red hover:bg-sparkasse-red/10'
                            }`}
                            aria-label='Vorherige Seite'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </button>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`w-8 h-8 rounded-lg ${
                                    currentPage === pageNumber
                                        ? 'bg-sparkasse-red text-white'
                                        : 'text-sparkasse-gray hover:bg-sparkasse-red/10'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg ${
                                currentPage === totalPages
                                    ? 'text-sparkasse-gray/30 cursor-not-allowed'
                                    : 'text-sparkasse-red hover:bg-sparkasse-red/10'
                            }`}
                            aria-label='Nächste Seite'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkTimeTracker;
