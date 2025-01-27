import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from './components/Header';
import ComponentContainer from './components/ComponentContainer';
import TimeInput from './components/TimeInput';
import Slider from './components/Slider';
import ProgressBar from './components/Progressbar';
import ShiftOverAnimation from './components/ShiftOverAnimation';
import WorkTimeTracker from './components/WorkTimeTracker';
import AuthForm from './components/AuthForm';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const getCurrentTime = () => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes()
        ).padStart(2, '0')}`;
    };

    const [sliderValue, setSliderValue] = useState(30);
    const [startTime, setStartTime] = useState(getCurrentTime());
    const [plannedOvertime, setPlannedOvertime] = useState('00:00');
    const [workTime, setWorkTime] = useState('07:36');
    const [remainingTime, setRemainingTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [progress, setProgress] = useState(0);
    const [isShiftOver, setIsShiftOver] = useState(false);
    const [currentArbeitszeitId, setCurrentArbeitszeitId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        // Prüfe beim Start, ob ein Token existiert
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleCloseShiftOver = () => {
        setIsShiftOver(false);
    };

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        // Lade die Daten für heute
        const loadTodayData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(
                    'http://localhost:5000/api/arbeitszeiten',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const today = new Date().toISOString().split('T')[0];
                const todaysEntry = response.data.find(
                    (entry) => entry.datum === today
                );

                if (todaysEntry) {
                    // Setze alle Felder entsprechend
                    setStartTime(todaysEntry.startZeit);
                    setEndTime(todaysEntry.endZeit);
                    setSliderValue(Number(todaysEntry.pausenZeit));

                    // Berechne die verbleibende Zeit
                    const now = new Date();
                    const [endHours, endMinutes] = todaysEntry.endZeit
                        .split(':')
                        .map(Number);
                    const endDate = new Date(now);
                    endDate.setHours(endHours, endMinutes, 0, 0);

                    if (endDate <= now) {
                        setRemainingTime('00:00:00');
                        setProgress(100);
                        setIsShiftOver(true);
                    } else {
                        const [startHours, startMinutes] = todaysEntry.startZeit
                            .split(':')
                            .map(Number);
                        const startDate = new Date(now);
                        startDate.setHours(startHours, startMinutes, 0, 0);

                        const totalDuration = endDate - startDate;
                        const elapsed = now - startDate;
                        const newProgress = Math.min(
                            100,
                            (elapsed / totalDuration) * 100
                        );

                        const diff = endDate - now;
                        const hours = Math.floor(diff / 3600000);
                        const minutes = Math.floor((diff % 3600000) / 60000);
                        const seconds = Math.floor((diff % 60000) / 1000);

                        setRemainingTime(
                            `${String(hours).padStart(2, '0')}:${String(
                                minutes
                            ).padStart(2, '0')}:${String(seconds).padStart(
                                2,
                                '0'
                            )}`
                        );
                        setProgress(newProgress);
                    }
                }
            } catch (error) {
                console.error('Fehler beim Laden der heutigen Daten:', error);
            }
        };

        loadTodayData();
    };

    const validateTimeInput = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
            return '00:00';
        }
        return time;
    };

    const saveArbeitszeit = async () => {
        const today = new Date().toISOString().split('T')[0];

        const arbeitszeit = {
            datum: today,
            startZeit: startTime,
            endZeit: endTime,
            pausenZeit: String(sliderValue),
            gesamtZeit: calculateGesamtZeit(startTime, endTime, sliderValue),
        };

        try {
            // Prüfe, ob bereits ein Eintrag für heute existiert
            const response = await axios.get(
                'http://localhost:5000/api/arbeitszeiten'
            );
            const todaysEntry = response.data.find(
                (entry) => entry.datum === today
            );

            if (todaysEntry) {
                // Vergleiche die Werte
                if (
                    todaysEntry.startZeit === arbeitszeit.startZeit &&
                    todaysEntry.endZeit === arbeitszeit.endZeit &&
                    todaysEntry.pausenZeit === arbeitszeit.pausenZeit &&
                    todaysEntry.gesamtZeit === arbeitszeit.gesamtZeit
                ) {
                    // Keine Änderungen, nichts zu tun
                    return;
                }

                // Aktualisiere den bestehenden Eintrag
                const updateResponse = await axios.put(
                    `http://localhost:5000/api/arbeitszeiten/${todaysEntry._id}`,
                    arbeitszeit
                );
                setCurrentArbeitszeitId(todaysEntry._id);
                return updateResponse;
            } else {
                // Erstelle einen neuen Eintrag
                const newEntry = await axios.post(
                    'http://localhost:5000/api/arbeitszeiten',
                    arbeitszeit
                );
                setCurrentArbeitszeitId(newEntry.data._id);
            }
        } catch (error) {
            console.error('Fehler beim Speichern der Arbeitszeit:', error);
            throw error; // Fehler weiterleiten
        }
    };

    const calculateGesamtZeit = (start, end, pause) => {
        if (!start || !end) return '00:00';

        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);

        // Berechne die Gesamtminuten, berücksichtige auch den Fall wenn die Endzeit am nächsten Tag ist
        let totalMinutes;
        if (
            endHours < startHours ||
            (endHours === startHours && endMinutes < startMinutes)
        ) {
            // Endzeit ist am nächsten Tag
            totalMinutes =
                (24 + endHours) * 60 +
                endMinutes -
                (startHours * 60 + startMinutes);
        } else {
            totalMinutes =
                endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
        }

        // Ziehe die Pause ab
        totalMinutes = totalMinutes - Number(pause);

        // Verhindere negative Zeiten
        if (totalMinutes < 0) totalMinutes = 0;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
            2,
            '0'
        )}`;
    };

    const handleSave = async () => {
        // Berechne die Endzeit basierend auf den aktuellen Eingaben
        const now = new Date();
        const validStartTime = validateTimeInput(startTime);
        const validPlannedOvertime = validateTimeInput(plannedOvertime);
        const validWorkTime = validateTimeInput(workTime);

        const [startHours, startMinutes] = validStartTime
            .split(':')
            .map(Number);
        const [overtimeHours, overtimeMinutes] = validPlannedOvertime
            .split(':')
            .map(Number);
        const [workHours, workMinutes] = validWorkTime.split(':').map(Number);

        const startDate = new Date(now);
        startDate.setHours(startHours, startMinutes, 0, 0);

        const totalMinutes =
            (workHours + overtimeHours) * 60 +
            workMinutes +
            overtimeMinutes +
            sliderValue;

        const endDate = new Date(startDate.getTime() + totalMinutes * 60000);
        const newEndTime = `${String(endDate.getHours()).padStart(
            2,
            '0'
        )}:${String(endDate.getMinutes()).padStart(2, '0')}`;

        // Setze die neue Endzeit im State
        setEndTime(newEndTime);

        // Berechne die verbleibende Zeit und den Fortschritt
        if (endDate <= now) {
            setRemainingTime('00:00:00');
            setProgress(100);
            setIsShiftOver(true);
        } else {
            const totalDuration = endDate - startDate;
            const elapsed = now - startDate;
            const newProgress = Math.min(100, (elapsed / totalDuration) * 100);

            const diff = endDate - now;
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            setRemainingTime(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
                    2,
                    '0'
                )}:${String(seconds).padStart(2, '0')}`
            );
            setProgress(newProgress);
        }

        // Erstelle das Arbeitszeitobjekt mit der berechneten Endzeit
        const today = new Date().toISOString().split('T')[0];
        const arbeitszeit = {
            datum: today,
            startZeit: startTime,
            endZeit: newEndTime,
            pausenZeit: String(sliderValue),
            gesamtZeit: calculateGesamtZeit(startTime, newEndTime, sliderValue),
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Nicht authentifiziert');
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            // Prüfe, ob bereits ein Eintrag für heute existiert
            const response = await axios.get(
                'http://localhost:5000/api/arbeitszeiten',
                { headers }
            );
            const todaysEntry = response.data.find(
                (entry) => entry.datum === today
            );

            if (todaysEntry) {
                // Vergleiche die Werte
                if (
                    todaysEntry.startZeit === arbeitszeit.startZeit &&
                    todaysEntry.endZeit === arbeitszeit.endZeit &&
                    todaysEntry.pausenZeit === arbeitszeit.pausenZeit &&
                    todaysEntry.gesamtZeit === arbeitszeit.gesamtZeit
                ) {
                    // Keine Änderungen, nichts zu tun
                    return;
                }

                // Aktualisiere den bestehenden Eintrag
                await axios.put(
                    `http://localhost:5000/api/arbeitszeiten/${todaysEntry._id}`,
                    arbeitszeit,
                    { headers }
                );
                setCurrentArbeitszeitId(todaysEntry._id);
            } else {
                // Erstelle einen neuen Eintrag
                const newEntry = await axios.post(
                    'http://localhost:5000/api/arbeitszeiten',
                    arbeitszeit,
                    { headers }
                );
                setCurrentArbeitszeitId(newEntry.data._id);
            }

            // Aktualisiere die Anzeige
            setRefreshTrigger((prev) => prev + 1);
        } catch (error) {
            console.error('Fehler beim Speichern der Arbeitszeit:', error);
            throw error;
        }
    };

    useEffect(() => {
        document.title = 'Feierabendrechner';

        // Lade die Daten für heute
        const loadTodayData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return; // Wenn kein Token vorhanden ist, breche ab

                const response = await axios.get(
                    'http://localhost:5000/api/arbeitszeiten',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const today = new Date().toISOString().split('T')[0];
                const todaysEntry = response.data.find(
                    (entry) => entry.datum === today
                );

                if (todaysEntry) {
                    // Setze alle Felder entsprechend
                    setStartTime(todaysEntry.startZeit);
                    setEndTime(todaysEntry.endZeit);
                    setSliderValue(Number(todaysEntry.pausenZeit));

                    // Berechne die verbleibende Zeit
                    const now = new Date();
                    const [endHours, endMinutes] = todaysEntry.endZeit
                        .split(':')
                        .map(Number);
                    const endDate = new Date(now);
                    endDate.setHours(endHours, endMinutes, 0, 0);

                    if (endDate <= now) {
                        setRemainingTime('00:00:00');
                        setProgress(100);
                        setIsShiftOver(true);
                    } else {
                        const [startHours, startMinutes] = todaysEntry.startZeit
                            .split(':')
                            .map(Number);
                        const startDate = new Date(now);
                        startDate.setHours(startHours, startMinutes, 0, 0);

                        const totalDuration = endDate - startDate;
                        const elapsed = now - startDate;
                        const newProgress = Math.min(
                            100,
                            (elapsed / totalDuration) * 100
                        );

                        const diff = endDate - now;
                        const hours = Math.floor(diff / 3600000);
                        const minutes = Math.floor((diff % 3600000) / 60000);
                        const seconds = Math.floor((diff % 60000) / 1000);

                        setRemainingTime(
                            `${String(hours).padStart(2, '0')}:${String(
                                minutes
                            ).padStart(2, '0')}:${String(seconds).padStart(
                                2,
                                '0'
                            )}`
                        );
                        setProgress(newProgress);

                        // Starte den Countdown
                        const interval = setInterval(() => {
                            const now = new Date();
                            if (endDate <= now) {
                                setRemainingTime('00:00:00');
                                setProgress(100);
                                setIsShiftOver(true);
                                clearInterval(interval);
                            } else {
                                const diff = endDate - now;
                                const hours = Math.floor(diff / 3600000);
                                const minutes = Math.floor(
                                    (diff % 3600000) / 60000
                                );
                                const seconds = Math.floor(
                                    (diff % 60000) / 1000
                                );

                                const elapsed = now - startDate;
                                const newProgress = Math.min(
                                    100,
                                    (elapsed / totalDuration) * 100
                                );

                                setRemainingTime(
                                    `${String(hours).padStart(2, '0')}:${String(
                                        minutes
                                    ).padStart(2, '0')}:${String(
                                        seconds
                                    ).padStart(2, '0')}`
                                );
                                setProgress(newProgress);
                            }
                        }, 1000);

                        return () => clearInterval(interval);
                    }
                }
            } catch (error) {
                console.error('Fehler beim Laden der heutigen Daten:', error);
            }
        };

        loadTodayData();
    }, [refreshTrigger]); // Füge refreshTrigger als Abhängigkeit hinzu

    return (
        <div className='min-h-screen bg-gray-50'>
            {isShiftOver ? (
                <div
                    className='fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm'
                    onClick={handleCloseShiftOver}
                >
                    <ShiftOverAnimation onClose={handleCloseShiftOver} />
                </div>
            ) : (
                <>
                    <Header remainingTime={remainingTime} progress={progress} />
                    <main className='container mx-auto px-8 py-12'>
                        <div className='flex flex-wrap justify-center gap-12'>
                            {/* Feierabendrechner */}
                            <div>
                                <ComponentContainer>
                                    <TimeInput
                                        label='Angefangen'
                                        value={startTime}
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
                                        }
                                        enabled={true}
                                    />
                                    <TimeInput
                                        label='Geplante Überstunden'
                                        value={plannedOvertime}
                                        onChange={(e) =>
                                            setPlannedOvertime(e.target.value)
                                        }
                                        enabled={true}
                                    />
                                    <TimeInput
                                        label='Arbeitszeit'
                                        value={workTime}
                                        onChange={(e) =>
                                            setWorkTime(e.target.value)
                                        }
                                        enabled={true}
                                    />
                                    <Slider
                                        label='Pause'
                                        value={sliderValue}
                                        onChange={(e) =>
                                            setSliderValue(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                    <TimeInput
                                        label='Feierabend'
                                        value={endTime}
                                        onChange={() => {}}
                                        enabled={false}
                                    />
                                    <button
                                        onClick={handleSave}
                                        disabled={!isAuthenticated}
                                        className={`w-full py-2 px-4 ${
                                            !isAuthenticated
                                                ? 'bg-sparkasse-gray/50 cursor-not-allowed'
                                                : 'bg-sparkasse-red hover:bg-sparkasse-darkred'
                                        } text-white rounded-lg transition-colors duration-200 font-medium shadow-sm`}
                                    >
                                        {isAuthenticated
                                            ? 'Speichern & Berechnen'
                                            : 'Bitte anmelden'}
                                    </button>
                                </ComponentContainer>
                            </div>

                            {/* Arbeitszeiterfassung oder Auth Form */}
                            <div className='space-y-8'>
                                {isAuthenticated ? (
                                    <WorkTimeTracker
                                        refreshTrigger={refreshTrigger}
                                    />
                                ) : (
                                    <AuthForm
                                        onAuthSuccess={handleAuthSuccess}
                                    />
                                )}
                            </div>
                        </div>
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
