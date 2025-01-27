import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import toastManager from '../services/toastManager';

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Abonniere Änderungen am Toast-Manager
        const unsubscribe = toastManager.subscribe((updatedToasts) => {
            setToasts(updatedToasts);
        });

        // Cleanup beim Unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => toastManager.removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
