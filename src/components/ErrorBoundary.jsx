import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                    <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8'>
                        <div className='text-center'>
                            <h2 className='text-2xl font-bold text-sparkasse-red mb-4'>
                                Oops! Ein Fehler ist aufgetreten
                            </h2>
                            <p className='text-gray-600 mb-4'>
                                Bitte laden Sie die Seite neu oder kontaktieren
                                Sie den Support, wenn das Problem weiterhin
                                besteht.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className='bg-sparkasse-red hover:bg-sparkasse-darkred text-white font-medium py-2 px-4 rounded transition-colors duration-200'
                            >
                                Seite neu laden
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
