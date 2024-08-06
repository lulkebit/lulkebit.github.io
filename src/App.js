import './App.css';

import React, { useState } from 'react';

import ComponentContainer from './components/ComponentContainer';
import TimeInput from './components/TimeInput';
import Header from './components/Header';
import Slider from './components/Slider';
import NumberInput from './components/NumberInput';

function App() {
    const [sliderValue, setSliderValue] = useState(30);

    const handleSliderChange = (e) => {
        setSliderValue(e.target.value);
    };

    const handleNumberInputChange = (e) => {
        const value = Math.max(0, Math.min(60, Number(e.target.value)));
        setSliderValue(value);
    };

    return (
        <div>
            <Header />
            <ComponentContainer>
                <TimeInput label='Angefangen' enabled={true} />
                <TimeInput label='Geplante Überstunden' enabled={true} />
                <TimeInput label='Arbeitszeit' value='07:48' enabled={true} />
                <Slider
                    label='Pause'
                    value={sliderValue}
                    onChange={(e) => setSliderValue(e.target.value)}
                />
            </ComponentContainer>
        </div>
    );
}

export default App;
