import axios from 'axios';
import ErrorService from './errorService';

const BASE_URL =
    process.env.REACT_APP_API_URL ||
    'https://feierabendrechner-backend.vercel.app';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    retry: 3,
    retryDelay: (retryCount) => {
        return retryCount * 2000;
    },
});

class ApiService {
    constructor() {
        this.client = api;
        this.retryCount = 0;
        this.maxRetries = 3;

        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                const isAuthEndpoint = config.url.includes('/auth/');

                if (!token && !isAuthEndpoint) {
                    throw new Error(
                        'Nicht authentifiziert. Bitte melden Sie sich an.'
                    );
                }

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                ErrorService.showNotification(
                    'Fehler bei der Anfrage-Vorbereitung',
                    'error'
                );
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (
                    (error.code === 'ECONNABORTED' || !error.response) &&
                    this.retryCount < this.maxRetries
                ) {
                    this.retryCount++;
                    const delayTime = this.retryCount * 2000;

                    await new Promise((resolve) =>
                        setTimeout(resolve, delayTime)
                    );
                    return this.client(error.config);
                }

                this.retryCount = 0;

                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    ErrorService.showNotification(
                        'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.',
                        'warning'
                    );
                    window.location.reload();
                }
                const errorMessage = ErrorService.handleApiError(error);
                ErrorService.showNotification(errorMessage, 'error');
                return Promise.reject(error);
            }
        );
    }

    async getArbeitszeiten() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(
                    'Nicht authentifiziert. Bitte melden Sie sich an.'
                );
            }

            const response = await this.client.get('/api/arbeitszeiten');

            if (!response.data) {
                throw new Error('Keine Daten vom Server erhalten');
            }

            return response.data;
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error(
                    'Der Server antwortet langsam. Ein erneuter Versuch wird unternommen...'
                );
            }
            if (!navigator.onLine) {
                throw new Error(
                    'Keine Internetverbindung verfügbar. Bitte überprüfen Sie Ihre Verbindung.'
                );
            }
            if (!error.response) {
                throw new Error(
                    'Verbindung zum Server konnte nicht hergestellt werden. Bitte versuchen Sie es später erneut.'
                );
            }
            throw new Error(
                'Fehler beim Laden der Arbeitszeiten: ' +
                    (error.response?.data?.message ||
                        error.message ||
                        'Unbekannter Fehler')
            );
        }
    }

    async saveArbeitszeit(arbeitszeit) {
        try {
            // Validiere die Zeiten
            ErrorService.validateTimeFormat(arbeitszeit.startZeit);
            ErrorService.validateTimeFormat(arbeitszeit.endZeit);
            ErrorService.validateTimeLogic(
                arbeitszeit.startZeit,
                arbeitszeit.endZeit
            );

            const today = new Date().toISOString().split('T')[0];
            const response = await this.getArbeitszeiten();
            const todaysEntry = response.find((entry) => entry.datum === today);

            if (todaysEntry) {
                if (this.isArbeitszeitUnchanged(todaysEntry, arbeitszeit)) {
                    ErrorService.showNotification(
                        'Keine Änderungen vorgenommen',
                        'info'
                    );
                    return todaysEntry;
                }
                const updateResponse = await this.client.put(
                    `/api/arbeitszeiten/${todaysEntry._id}`,
                    arbeitszeit
                );
                ErrorService.showNotification(
                    'Arbeitszeit erfolgreich aktualisiert',
                    'success'
                );
                return updateResponse.data;
            } else {
                const newEntry = await this.client.post(
                    '/api/arbeitszeiten',
                    arbeitszeit
                );
                ErrorService.showNotification(
                    'Neue Arbeitszeit erfolgreich gespeichert',
                    'success'
                );
                return newEntry.data;
            }
        } catch (error) {
            const errorMessage = ErrorService.handleApiError(
                error,
                'Fehler beim Speichern der Arbeitszeit'
            );
            ErrorService.showNotification(errorMessage, 'error');
            throw error;
        }
    }

    isArbeitszeitUnchanged(existing, new_) {
        try {
            return (
                existing.startZeit === new_.startZeit &&
                existing.endZeit === new_.endZeit &&
                existing.pausenZeit === new_.pausenZeit &&
                existing.gesamtZeit === new_.gesamtZeit
            );
        } catch (error) {
            console.error('Fehler beim Vergleich der Arbeitszeiten:', error);
            return false;
        }
    }

    async login(credentials) {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/auth/login`,
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', credentials.username);
                return response.data;
            } else {
                throw new Error('Keine Token in der Antwort gefunden');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Benutzername oder Passwort ist falsch');
            }
            throw new Error(
                'Fehler beim Login: ' +
                    (error.response?.data?.message || error.message)
            );
        }
    }

    async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }
}

export default new ApiService();
