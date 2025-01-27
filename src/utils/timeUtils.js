export const validateTimeInput = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
        return '00:00';
    }
    return time;
};

export const calculateGesamtZeit = (start, end, pause) => {
    if (!start || !end) return '00:00';

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

    totalMinutes = totalMinutes - Number(pause);
    if (totalMinutes < 0) totalMinutes = 0;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
    )}`;
};

export const calculateEndTime = (
    startTime,
    workTime,
    plannedOvertime,
    pauseTime
) => {
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

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);
    const endDate = new Date(startDate.getTime() + totalMinutes * 60000);

    return {
        endTime: `${String(endDate.getHours()).padStart(2, '0')}:${String(
            endDate.getMinutes()
        ).padStart(2, '0')}`,
        endDate,
    };
};

export const calculateRemainingTime = (endDate) => {
    const now = new Date();

    if (endDate <= now) {
        return {
            remainingTime: '00:00:00',
            progress: 100,
            isShiftOver: true,
        };
    }

    const diff = endDate - now;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return {
        remainingTime: `${String(hours).padStart(2, '0')}:${String(
            minutes
        ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        progress: Math.min(100, ((now - endDate) / (endDate - now)) * 100),
        isShiftOver: false,
    };
};

export const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
    ).padStart(2, '0')}`;
};
