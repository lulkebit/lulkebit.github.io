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
                `https://feierabendrechner-backend.onrender.com:10000${endpoint}`,
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
        <div className='m-8'>
            <div className='bg-white rounded-xl shadow-lg p-8 w-96 border-t-4 border-sparkasse-red relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sparkasse-red/5 to-transparent rounded-full transform translate-x-16 -translate-y-16'></div>
                <div className='absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-sparkasse-red/5 to-transparent rounded-full transform -translate-x-20 translate-y-20'></div>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sparkasse-red to-sparkasse-red/70'></div>

                <div className='relative z-10'>
                    <div className='text-center mb-8'>
                        <h2 className='text-xl font-semibold text-sparkasse-gray'>
                            {isLogin ? 'Anmelden' : 'Registrieren'}
                        </h2>
                        <p className='text-sparkasse-gray/70 mt-2 text-sm'>
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

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='relative group p-2 rounded-lg hover:bg-sparkasse-red/5 transition-colors'>
                            <label
                                htmlFor='username'
                                className='absolute left-5 -top-2.5 transition-all duration-200 transform 
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-sparkasse-gray/50 peer-placeholder-shown:top-5
                                peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-sparkasse-red
                                text-xs text-sparkasse-gray/90 font-medium tracking-wide
                                cursor-text bg-white px-1 z-10'
                            >
                                Benutzername
                            </label>
                            <input
                                type='text'
                                id='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='peer w-full px-3 py-2 bg-white border-2 border-sparkasse-gray/15 group-hover:border-sparkasse-red/30 rounded-lg focus:outline-none focus:border-sparkasse-red focus:ring-2 focus:ring-sparkasse-red/20 placeholder-transparent transition-all duration-200'
                                required
                                minLength={3}
                                placeholder='Benutzername'
                            />
                            {!isLogin && (
                                <p className='text-sm text-sparkasse-gray/70 mt-1 italic'>
                                    Bitte wählen Sie einen Benutzernamen, der
                                    keine Rückschlüsse auf Ihre Person zulässt,
                                    um die Anonymität zu wahren.
                                </p>
                            )}
                        </div>

                        <div className='relative group p-2 rounded-lg hover:bg-sparkasse-red/5 transition-colors'>
                            <label
                                htmlFor='password'
                                className='absolute left-5 -top-2.5 transition-all duration-200 transform 
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-sparkasse-gray/50 peer-placeholder-shown:top-5
                                peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-sparkasse-red
                                text-xs text-sparkasse-gray/90 font-medium tracking-wide
                                cursor-text bg-white px-1 z-10'
                            >
                                Passwort
                            </label>
                            <input
                                type='password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='peer w-full px-3 py-2 bg-white border-2 border-sparkasse-gray/15 group-hover:border-sparkasse-red/30 rounded-lg focus:outline-none focus:border-sparkasse-red focus:ring-2 focus:ring-sparkasse-red/20 placeholder-transparent transition-all duration-200'
                                required
                                minLength={6}
                                placeholder='Passwort'
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

                        <div className='text-center'>
                            <button
                                type='button'
                                onClick={() => setIsLogin(!isLogin)}
                                className='text-sparkasse-red hover:text-sparkasse-darkred text-sm transition-colors duration-200'
                            >
                                {isLogin
                                    ? 'Noch kein Konto? Jetzt registrieren'
                                    : 'Bereits registriert? Jetzt anmelden'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
