import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const response = await axios.post(
                `http://localhost:5000${endpoint}`,
                {
                    username,
                    password,
                }
            );

            // Token und Username im localStorage speichern
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);

            // Callback aufrufen
            onAuthSuccess(response.data);

            // Felder zurücksetzen
            setUsername('');
            setPassword('');
        } catch (error) {
            setError(
                error.response?.data?.message || 'Ein Fehler ist aufgetreten'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto'>
            <div className='text-center mb-8'>
                <h2 className='text-2xl font-bold text-sparkasse-gray'>
                    {isLogin ? 'Anmelden' : 'Registrieren'}
                </h2>
                <p className='text-sparkasse-gray/70 mt-2'>
                    {isLogin
                        ? 'Melden Sie sich an, um Ihre Arbeitszeiten zu verwalten'
                        : 'Erstellen Sie ein neues Konto'}
                </p>
            </div>

            {error && (
                <div className='bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm'>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label
                        htmlFor='username'
                        className='block text-sm font-medium text-sparkasse-gray mb-1'
                    >
                        Benutzername
                    </label>
                    <input
                        type='text'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='w-full px-3 py-2 border border-sparkasse-gray/20 rounded-lg focus:outline-none focus:border-sparkasse-red focus:ring-2 focus:ring-sparkasse-red/20'
                        required
                        minLength={3}
                    />
                    {!isLogin && (
                        <p className='text-sm text-sparkasse-gray/70 mt-1 italic'>
                            Bitte wählen Sie einen Benutzernamen, der keine
                            Rückschlüsse auf Ihre Person zulässt, um die
                            Anonymität zu wahren.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor='password'
                        className='block text-sm font-medium text-sparkasse-gray mb-1'
                    >
                        Passwort
                    </label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full px-3 py-2 border border-sparkasse-gray/20 rounded-lg focus:outline-none focus:border-sparkasse-red focus:ring-2 focus:ring-sparkasse-red/20'
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className={`w-full py-2 px-4 ${
                        loading
                            ? 'bg-sparkasse-gray/50'
                            : 'bg-sparkasse-red hover:bg-sparkasse-darkred'
                    } text-white rounded-lg transition-colors duration-200 font-medium shadow-sm`}
                >
                    {loading
                        ? 'Wird verarbeitet...'
                        : isLogin
                        ? 'Anmelden'
                        : 'Registrieren'}
                </button>

                <div className='text-center mt-4'>
                    <button
                        type='button'
                        onClick={() => setIsLogin(!isLogin)}
                        className='text-sparkasse-red hover:text-sparkasse-darkred text-sm'
                    >
                        {isLogin
                            ? 'Noch kein Konto? Jetzt registrieren'
                            : 'Bereits registriert? Jetzt anmelden'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuthForm;
