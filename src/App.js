import './App.css';
import ComponentContainer from './components/ComponentContainer';
import TimeInput from './components/TimeInput';
import Header from './components/Header';

function App() {
    return (
        <div>
            <Header />
            <ComponentContainer>
                <TimeInput label='Angefangen:' enabled={true} />
                <TimeInput label='Geplante Überstunden:' enabled={true} />
                <TimeInput label='Arbeitszeit:' value='07:48' enabled={true} />
            </ComponentContainer>
        </div>
    );
}

export default App;
