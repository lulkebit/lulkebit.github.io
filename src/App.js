import './App.css';
import React, { useState, useEffect, useCallback } from 'react';

import Header from './components/Header';
import ComponentContainer from './components/ComponentContainer';
import TimeInput from './components/TimeInput';
import Slider from './components/Slider';
import ProgressBar from './components/Progressbar';
import ShiftOverAnimation from './components/ShiftOverAnimation';
import WorkTimeTracker from './components/WorkTimeTracker';
import AuthForm from './components/AuthForm';
import ErrorBoundary from './components/ErrorBoundary';

import apiService from './services/api';
import {
    validateTimeInput,
    calculateGesamtZeit,
    calculateEndTime,
    calculateRemainingTime,
    getCurrentTime,
} from './utils/timeUtils';

// Konstanten auslagern
const DEFAULT_WORK_TIME = '07:36';
const DEFAULT_OVERTIME = '00:00';
const DEFAULT_PAUSE = 30;

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sliderValue, setSliderValue] = useState(DEFAULT_PAUSE);
    const [startTime, setStartTime] = useState(getCurrentTime);
    const [plannedOvertime, setPlannedOvertime] = useState(DEFAULT_OVERTIME);
    const [workTime, setWorkTime] = useState(DEFAULT_WORK_TIME);
    const [remainingTime, setRemainingTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [progress, setProgress] = useState(0);
    const [isShiftOver, setIsShiftOver] = useState(false);
    const [currentArbeitszeitId, setCurrentArbeitszeitId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        document.title = 'Feierabendrechner';
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleCloseShiftOver = useCallback(() => {
        setIsShiftOver(false);
    }, []);

    const handleAuthSuccess = useCallback(() => {
        setIsAuthenticated(true);
        loadTodayData();
    }, []);

    const loadTodayData = useCallback(async () => {
        try {
            if (!isAuthenticated) return;

            const arbeitszeiten = await apiService.getArbeitszeiten();
            const today = new Date().toISOString().split('T')[0];
            const todaysEntry = arbeitszeiten.find(
                (entry) => entry.datum === today
            );

            if (todaysEntry) {
                setStartTime(todaysEntry.startZeit);
                setEndTime(todaysEntry.endZeit);
                setSliderValue(Number(todaysEntry.pausenZeit));

                const [endHours, endMinutes] = todaysEntry.endZeit
                    .split(':')
                    .map(Number);
                const endDate = new Date();
                endDate.setHours(endHours, endMinutes, 0, 0);

                updateTimeAndProgress(endDate);
            }
        } catch (error) {
            console.error('Fehler beim Laden der heutigen Daten:', error);
        }
    }, [isAuthenticated]);

    const updateTimeAndProgress = useCallback((endDate) => {
        const {
            remainingTime: newRemainingTime,
            progress: newProgress,
            isShiftOver: newIsShiftOver,
        } = calculateRemainingTime(endDate);

        setRemainingTime(newRemainingTime);
        setProgress(newProgress);
        setIsShiftOver(newIsShiftOver);

        if (!newIsShiftOver) {
            const interval = setInterval(() => {
                const {
                    remainingTime: updatedRemainingTime,
                    progress: updatedProgress,
                    isShiftOver: updatedIsShiftOver,
                } = calculateRemainingTime(endDate);

                setRemainingTime(updatedRemainingTime);
                setProgress(updatedProgress);
                setIsShiftOver(updatedIsShiftOver);

                if (updatedIsShiftOver) {
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, []);

    const handleSave = useCallback(async () => {
        try {
            const validStartTime = validateTimeInput(startTime);
            const validPlannedOvertime = validateTimeInput(plannedOvertime);
            const validWorkTime = validateTimeInput(workTime);

            const { endTime: newEndTime, endDate } = calculateEndTime(
                validStartTime,
                validWorkTime,
                validPlannedOvertime,
                sliderValue
            );

            setEndTime(newEndTime);
            updateTimeAndProgress(endDate);

            const today = new Date().toISOString().split('T')[0];
            const arbeitszeit = {
                datum: today,
                startZeit: validStartTime,
                endZeit: newEndTime,
                pausenZeit: String(sliderValue),
                gesamtZeit: calculateGesamtZeit(
                    validStartTime,
                    newEndTime,
                    sliderValue
                ),
            };

            const result = await apiService.saveArbeitszeit(arbeitszeit);
            setCurrentArbeitszeitId(result._id);
            setRefreshTrigger((prev) => prev + 1);
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
        }
    }, [
        startTime,
        plannedOvertime,
        workTime,
        sliderValue,
        updateTimeAndProgress,
    ]);

    useEffect(() => {
        loadTodayData();
    }, [loadTodayData, refreshTrigger]);

    return (
        <ErrorBoundary>
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
                        <Header
                            remainingTime={remainingTime}
                            progress={progress}
                        />
                        <main className='container mx-auto px-8 py-12'>
                            <div className='flex flex-wrap justify-center gap-12'>
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
                                                setPlannedOvertime(
                                                    e.target.value
                                                )
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
        </ErrorBoundary>
    );
}

export default App;
