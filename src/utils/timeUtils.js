import ErrorService from '../services/errorService';

export const validateTimeInput = (time) => {
    try {
        ErrorService.validateTimeFormat(time);
        const [hours, minutes] = time.split(':').map(Number);

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new Error('Invalid time range');
        }

        return time;
    } catch (error) {
        const errorMessage = ErrorService.handleTimeError(error);
        ErrorService.showNotification(errorMessage, 'error');
        return '00:00';
    }
};

export const calculateGesamtZeit = (start, end, pause) => {
    try {
        if (!start || !end) {
            throw new Error('Start- und Endzeit müssen angegeben werden');
        }

        ErrorService.validateTimeFormat(start);
        ErrorService.validateTimeFormat(end);

        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);

        let totalMinutes;
        if (
            endHours < startHours ||
            (endHours === startHours && endMinutes < startMinutes)
        ) {
            totalMinutes =
                (24 + endHours) * 60 +
                endMinutes -
                (startHours * 60 + startMinutes);
        } else {
            totalMinutes =
                endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
        }

        const pauseNumber = Number(pause);
        if (isNaN(pauseNumber) || pauseNumber < 0) {
            throw new Error('Ungültige Pausenzeit');
        }

        totalMinutes = totalMinutes - pauseNumber;
        if (totalMinutes < 0) {
            throw new Error('Die Gesamtarbeitszeit kann nicht negativ sein');
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
            2,
            '0'
        )}`;
    } catch (error) {
        ErrorService.showNotification(error.message, 'error');
        return '00:00';
    }
};

export const calculateEndTime = (
    startTime,
    workTime,
    plannedOvertime,
    pauseTime
) => {
    try {
        ErrorService.validateTimeFormat(startTime);
        ErrorService.validateTimeFormat(workTime);
        ErrorService.validateTimeFormat(plannedOvertime);

        if (isNaN(Number(pauseTime)) || Number(pauseTime) < 0) {
            throw new Error('Ungültige Pausenzeit');
        }

        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [workHours, workMinutes] = workTime.split(':').map(Number);
        const [overtimeHours, overtimeMinutes] = plannedOvertime
            .split(':')
            .map(Number);

        const totalMinutes =
            (workHours + overtimeHours) * 60 +
            workMinutes +
            overtimeMinutes +
            Number(pauseTime);

        if (totalMinutes <= 0) {
            throw new Error('Die Gesamtarbeitszeit muss positiv sein');
        }

        const startDate = new Date();
        startDate.setHours(startHours, startMinutes, 0, 0);
        const endDate = new Date(startDate.getTime() + totalMinutes * 60000);

        return {
            endTime: `${String(endDate.getHours()).padStart(2, '0')}:${String(
                endDate.getMinutes()
            ).padStart(2, '0')}`,
            endDate,
        };
    } catch (error) {
        ErrorService.showNotification(error.message, 'error');
        const now = new Date();
        return {
            endTime: '00:00',
            endDate: now,
        };
    }
};

export const calculateRemainingTime = (endDate) => {
    try {
        const now = new Date();

        if (!(endDate instanceof Date) || isNaN(endDate)) {
            throw new Error('Ungültiges Enddatum');
        }

        if (endDate <= now) {
            return {
                remainingTime: '00:00:00',
                progress: 100,
                isShiftOver: true,
            };
        }

        const diff = endDate - now;
        if (diff < 0) {
            throw new Error('Negative Zeitdifferenz');
        }

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        // Berechne die Startzeit des aktuellen Arbeitstages
        const startOfShift = new Date(endDate);
        startOfShift.setHours(startOfShift.getHours() - 8); // Annahme: 8-Stunden-Arbeitstag

        // Berechne den Fortschritt basierend auf der verstrichenen Zeit seit Arbeitsbeginn
        const totalWorkDuration = endDate - startOfShift;
        const elapsedDuration = now - startOfShift;

        const progress = Math.min(
            100,
            Math.max(0, (elapsedDuration / totalWorkDuration) * 100)
        );

        return {
            remainingTime: `${String(hours).padStart(2, '0')}:${String(
                minutes
            ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
            progress: isNaN(progress) ? 0 : progress,
            isShiftOver: false,
        };
    } catch (error) {
        ErrorService.showNotification('Fehler bei der Zeitberechnung', 'error');
        return {
            remainingTime: '00:00:00',
            progress: 0,
            isShiftOver: false,
        };
    }
};

export const getCurrentTime = () => {
    try {
        const now = new Date();
        if (isNaN(now.getTime())) {
            throw new Error('Ungültiges Systemdatum');
        }
        return `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes()
        ).padStart(2, '0')}`;
    } catch (error) {
        ErrorService.showNotification(
            'Fehler beim Abrufen der aktuellen Zeit',
            'error'
        );
        return '00:00';
    }
};
