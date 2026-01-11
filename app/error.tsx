'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Something went wrong!</h2>
                <p className="text-text-secondary">We apologize for the inconvenience.</p>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary transition-colors"
                >
                    Try again
                </button>
            </div>
        </main>
    );
}
