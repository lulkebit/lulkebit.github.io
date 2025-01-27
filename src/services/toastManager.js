class ToastManager {
    constructor() {
        this.listeners = new Set();
        this.toasts = [];
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify(message, type = 'error', duration = 5000) {
        const toast = {
            id: Date.now(),
            message,
            type,
            duration,
        };

        this.toasts.push(toast);
        this.notifyListeners();

        // Automatisches Entfernen nach der angegebenen Dauer
        setTimeout(() => {
            this.removeToast(toast.id);
        }, duration);
    }

    removeToast(id) {
        this.toasts = this.toasts.filter((toast) => toast.id !== id);
        this.notifyListeners();
    }

    notifyListeners() {
        this.listeners.forEach((listener) => listener(this.toasts));
    }

    // Hilfsmethoden für verschiedene Benachrichtigungstypen
    success(message, duration = 5000) {
        this.notify(message, 'success', duration);
    }

    error(message, duration = 5000) {
        this.notify(message, 'error', duration);
    }

    warning(message, duration = 5000) {
        this.notify(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        this.notify(message, 'info', duration);
    }
}

export default new ToastManager();
