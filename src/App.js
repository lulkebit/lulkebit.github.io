import './App.css';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ComponentContainer from './components/ComponentContainer';
import TimeInput from './components/TimeInput';
import Slider from './components/Slider';

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
    const [workTime, setWorkTime] = useState('07:48');
    const [remainingTime, setRemainingTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const calculateTimes = () => {
        const now = new Date();
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [overtimeHours, overtimeMinutes] = plannedOvertime
            .split(':')
            .map(Number);
        const [workHours, workMinutes] = workTime.split(':').map(Number);

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
            return;
        }

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
    };

    useEffect(() => {
        const interval = setInterval(calculateTimes, 1000);
        return () => clearInterval(interval);
    }, [startTime, plannedOvertime, workTime, sliderValue]);

    return (
        <div>
            <Header />
            <ComponentContainer>
                <TimeInput
                    label='Angefangen'
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    enabled={true}
                />
                <TimeInput
                    label='Geplante Überstunden'
                    value={plannedOvertime}
                    onChange={(e) => setPlannedOvertime(e.target.value)}
                    enabled={true}
                />
                <TimeInput
                    label='Arbeitszeit'
                    value={workTime}
                    onChange={(e) => setWorkTime(e.target.value)}
                    enabled={true}
                />
                <Slider
                    label='Pause'
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                />
                <TimeInput
                    label='Feierabend'
                    value={endTime}
                    onChange={() => {}}
                    enabled={false}
                />
            </ComponentContainer>
            <div className='text-4xl font-bold mt-8'>
                Feierabend in: {remainingTime}
            </div>
        </div>
    );
}

export default App;
