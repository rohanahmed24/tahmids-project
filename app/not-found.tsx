import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
            <div className="text-center space-y-6">
                <h1 className="text-6xl font-bold">404</h1>
                <h2 className="text-2xl font-semibold">Page Not Found</h2>
                <p className="text-text-secondary max-w-md">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </main>
    );
}
