import './App.css';
import React, { useState, useEffect } from 'react';

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

    const validateTimeInput = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
            return '00:00';
        }
        return time;
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
            setIsShiftOver(true); // Set shift over state
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

        setEndTime(
            `${String(endDate.getHours()).padStart(2, '0')}:${String(
                endDate.getMinutes()
            ).padStart(2, '0')}`
        );

        setProgress(newProgress);
    };

    useEffect(() => {
        document.title = 'Feierabendrechner';
        const interval = setInterval(calculateTimes, 10);
        return () => clearInterval(interval);
    }, [startTime, plannedOvertime, workTime, sliderValue]);

    return (
        <div className='min-h-screen bg-gray-50'>
            {isShiftOver ? (
                <ShiftOverAnimation />
            ) : (
                <>
                    <Header remainingTime={remainingTime} />
                    <main className='container mx-auto px-8 py-12'>
                        <div className='flex justify-center gap-12'>
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
                            <div>
                                <WorkTimeTracker />
                            </div>
                        </div>

                        {/* Progressbar mittig */}
                        <div className='mt-8 max-w-2xl mx-auto'>
                            <ProgressBar progress={progress} />
                        </div>
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
