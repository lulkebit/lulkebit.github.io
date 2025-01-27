import toastManager from './toastManager';

class ErrorService {
    static handleApiError(error, customMessage = '') {
        let errorMessage = 'Ein unerwarteter Fehler ist aufgetreten.';

        if (error.response) {
            // Server-Fehler mit Response
            switch (error.response.status) {
                case 400:
                    errorMessage =
                        'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben.';
                    break;
                case 401:
                    errorMessage =
                        'Nicht autorisiert. Bitte melden Sie sich erneut an.';
                    break;
                case 403:
                    errorMessage =
                        'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.';
                    break;
                case 404:
                    errorMessage =
                        'Die angeforderte Ressource wurde nicht gefunden.';
                    break;
                case 500:
                    errorMessage =
                        'Interner Serverfehler. Bitte versuchen Sie es später erneut.';
                    break;
                default:
                    errorMessage = `Serverfehler: ${error.response.status}`;
            }
        } else if (error.request) {
            // Keine Antwort vom Server
            errorMessage =
                'Keine Antwort vom Server. Bitte überprüfen Sie Ihre Internetverbindung.';
        }

        // Füge custom message hinzu, falls vorhanden
        if (customMessage) {
            errorMessage = `${customMessage}: ${errorMessage}`;
        }

        // Logging für Entwickler
        console.error('Error Details:', {
            message: errorMessage,
            originalError: error,
            timestamp: new Date().toISOString(),
            customMessage,
        });

        return errorMessage;
    }

    static handleTimeError(error) {
        let errorMessage = 'Ungültige Zeiteingabe';

        if (error.message.includes('Invalid time')) {
            errorMessage = 'Ungültiges Zeitformat. Bitte verwenden Sie HH:MM.';
        } else if (error.message.includes('Future time')) {
            errorMessage = 'Die Startzeit kann nicht in der Zukunft liegen.';
        } else if (error.message.includes('Past time')) {
            errorMessage =
                'Die Endzeit kann nicht in der Vergangenheit liegen.';
        }

        console.error('Time Error:', {
            message: errorMessage,
            originalError: error,
            timestamp: new Date().toISOString(),
        });

        return errorMessage;
    }

    static validateTimeFormat(time) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) {
            throw new Error('Invalid time format');
        }
    }

    static validateTimeLogic(startTime, endTime) {
        const now = new Date();
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const startDate = new Date(now);
        startDate.setHours(startHours, startMinutes, 0, 0);

        const [endHours, endMinutes] = endTime.split(':').map(Number);
        const endDate = new Date(now);
        endDate.setHours(endHours, endMinutes, 0, 0);

        if (startDate > now) {
            throw new Error('Future time not allowed');
        }

        if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }

        return { startDate, endDate };
    }

    static showNotification(message, type = 'error') {
        switch (type) {
            case 'success':
                toastManager.success(message);
                break;
            case 'warning':
                toastManager.warning(message);
                break;
            case 'info':
                toastManager.info(message);
                break;
            case 'error':
            default:
                toastManager.error(message);
                break;
        }
    }
}

export default ErrorService;
