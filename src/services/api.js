import axios from 'axios';
import ErrorService from './errorService';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
    constructor() {
        this.client = axios.create({
            baseURL: BASE_URL,
            timeout: 5000,
        });

        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                config.headers.Authorization = `Bearer ${token}`;
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
            (error) => {
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
            const response = await this.client.get('/api/arbeitszeiten');
            return response.data;
        } catch (error) {
            const errorMessage = ErrorService.handleApiError(
                error,
                'Fehler beim Laden der Arbeitszeiten'
            );
            ErrorService.showNotification(errorMessage, 'error');
            throw error;
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
}

export default new ApiService();
