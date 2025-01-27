import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
    constructor() {
        this.client = axios.create({
            baseURL: BASE_URL,
            timeout: 5000,
        });

        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.reload();
                }
                return Promise.reject(error);
            }
        );
    }

    async getArbeitszeiten() {
        try {
            const response = await this.client.get('/api/arbeitszeiten');
            return response.data;
        } catch (error) {
            console.error('Fehler beim Laden der Arbeitszeiten:', error);
            throw error;
        }
    }

    async saveArbeitszeit(arbeitszeit) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await this.getArbeitszeiten();
            const todaysEntry = response.find((entry) => entry.datum === today);

            if (todaysEntry) {
                if (this.isArbeitszeitUnchanged(todaysEntry, arbeitszeit)) {
                    return todaysEntry;
                }
                const updateResponse = await this.client.put(
                    `/api/arbeitszeiten/${todaysEntry._id}`,
                    arbeitszeit
                );
                return updateResponse.data;
            } else {
                const newEntry = await this.client.post(
                    '/api/arbeitszeiten',
                    arbeitszeit
                );
                return newEntry.data;
            }
        } catch (error) {
            console.error('Fehler beim Speichern der Arbeitszeit:', error);
            throw error;
        }
    }

    isArbeitszeitUnchanged(existing, new_) {
        return (
            existing.startZeit === new_.startZeit &&
            existing.endZeit === new_.endZeit &&
            existing.pausenZeit === new_.pausenZeit &&
            existing.gesamtZeit === new_.gesamtZeit
        );
    }
}

export default new ApiService();
