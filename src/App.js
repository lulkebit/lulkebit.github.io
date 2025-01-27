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

function App() {
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
                await axios.put(
                    `http://localhost:5000/api/arbeitszeiten/${todaysEntry._id}`,
                    arbeitszeit
                );
                setCurrentArbeitszeitId(todaysEntry._id);
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
        }
    };

    const calculateGesamtZeit = (start, end, pause) => {
        if (!start || !end) return '00:00';

        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);

        let totalMinutes =
            endHours * 60 +
            endMinutes -
            (startHours * 60 + startMinutes) -
            Number(pause);

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
            2,
            '0'
        )}`;
    };

    const calculateTimes = () => {
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

        if (endDate <= now) {
            setRemainingTime('00:00:00');
            setEndTime(getCurrentTime());
            setProgress(100);
            setIsShiftOver(true);
            saveArbeitszeit();
            return;
        }

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

        const newEndTime = `${String(endDate.getHours()).padStart(
            2,
            '0'
        )}:${String(endDate.getMinutes()).padStart(2, '0')}`;

        setEndTime(newEndTime);
        setProgress(newProgress);
    };

    useEffect(() => {
        document.title = 'Feierabendrechner';
        const interval = setInterval(calculateTimes, 10);
        return () => clearInterval(interval);
    }, [startTime, plannedOvertime, workTime, sliderValue]);

    // Effekt für das automatische Speichern bei Änderungen
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (startTime && endTime) {
                saveArbeitszeit();
            }
        }, 1000); // Warte 1 Sekunde nach der letzten Änderung

        return () => clearTimeout(debounceTimer);
    }, [startTime, endTime, sliderValue]);

    return (
        <div className='min-h-screen bg-gray-50'>
            {isShiftOver ? (
                <ShiftOverAnimation />
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
                                </ComponentContainer>
                            </div>

                            {/* Arbeitszeiterfassung */}
                            <div className='space-y-8'>
                                <WorkTimeTracker />
                            </div>
                        </div>
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
