import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { MediaStatsCards } from "@/components/admin/MediaStatsCards";
import { MediaErrorBoundary } from "@/components/admin/MediaErrorBoundary";
import { getMediaStats, getAllMedia } from "@/lib/media-service";
import { Upload, Folder } from "lucide-react";

export const metadata: Metadata = {
    title: "Media Library - Admin Dashboard",
    description: "Manage your images, videos, and documents",
    robots: "noindex, nofollow" // Admin pages shouldn't be indexed
};

export default async function MediaPage() {
    const session = await getAdminSession();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    // Fetch media stats and media items with error handling
    const [mediaStats, mediaItems] = await Promise.all([
        getMediaStats(),
        getAllMedia()
    ]);

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1600px] mx-auto p-6 space-y-8">
                {/* Header */}
                <MediaPageHeader />

                {/* Stats Cards with Error Boundary */}
                <MediaErrorBoundary>
                    <MediaStatsCards stats={mediaStats} />
                </MediaErrorBoundary>

                {/* Media Library Component with Error Boundary */}
                <MediaErrorBoundary>
                    <Suspense fallback={<MediaLibraryFallback />}>
                        <MediaLibrary initialMedia={mediaItems} />
                    </Suspense>
                </MediaErrorBoundary>
            </div>
        </div>
    );
}


// Extracted header component for better organization
"use client";
function MediaPageHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Media Library</h1>
                <p className="text-text-secondary mt-2">Manage your images, videos, and documents</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => alert("Folder creation coming soon!")}
                    className="px-4 py-2 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
                    aria-label="Create new folder"
                >
                    <Folder className="w-4 h-4 inline mr-2" />
                    New Folder
                </button>
                <button
                    onClick={() => alert("Upload feature coming soon!")}
                    className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
                    aria-label="Upload media files"
                >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Media
                </button>
            </div>
        </div>
    );
}

// Extracted fallback component for better reusability
function MediaLibraryFallback() {
    return (
        <div className="h-96 bg-bg-secondary rounded-xl animate-pulse border border-border-primary">
            <div className="p-6">
                <div className="h-4 bg-bg-tertiary rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-bg-tertiary rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}