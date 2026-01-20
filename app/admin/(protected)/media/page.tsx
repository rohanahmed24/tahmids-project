import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { MediaPageHeader } from "@/components/admin/MediaPageHeader";
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