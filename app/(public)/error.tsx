'use client';

import { useEffect } from 'react';
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            title: "কিছু একটা ভুল হয়েছে!",
            body: "অসুবিধার জন্য আমরা দুঃখিত।",
            cta: "আবার চেষ্টা করুন",
        }
        : {
            title: "Something went wrong!",
            body: "We apologize for the inconvenience.",
            cta: "Try again",
        };

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{copy.title}</h2>
                <p className="text-text-secondary">{copy.body}</p>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary transition-colors"
                >
                    {copy.cta}
                </button>
            </div>
        </main>
    );
}
