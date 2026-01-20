import { prisma } from "@/lib/db";
import { Media } from "@prisma/client";


export interface MediaStats {
    totalImages: number;
    totalVideos: number;
    totalDocuments: number;
    totalStorageUsed: string;
}

export interface MediaItem {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    altText?: string;
    createdAt: string;
}

export async function getMediaStats(): Promise<MediaStats> {
    try {
        // Use raw query for complex aggregation matching original logic
        const rows = await prisma.$queryRaw<Array<{
            totalImages: bigint;
            totalVideos: bigint;
            totalDocuments: bigint;
            totalSize: bigint;
        }>>`
            SELECT 
                COUNT(CASE WHEN mime_type LIKE 'image/%' THEN 1 END) as totalImages,
                COUNT(CASE WHEN mime_type LIKE 'video/%' THEN 1 END) as totalVideos,
                COUNT(CASE WHEN mime_type NOT LIKE 'image/%' AND mime_type NOT LIKE 'video/%' THEN 1 END) as totalDocuments,
                COALESCE(SUM(size), 0) as totalSize
            FROM media
        `;

        const stats = rows[0];
        // Ensure numbers are handled correctly (BigInt to Number if needed)
        const totalSize = Number(stats?.totalSize) || 0;
        const totalSizeGB = totalSize / (1024 * 1024 * 1024);

        return {
            totalImages: Number(stats?.totalImages) || 0,
            totalVideos: Number(stats?.totalVideos) || 0,
            totalDocuments: Number(stats?.totalDocuments) || 0,
            totalStorageUsed: `${totalSizeGB.toFixed(1)} GB`
        };
    } catch (error) {
        console.error("Error fetching media stats:", error);
        // Fallback data
        return {
            totalImages: 0,
            totalVideos: 0,
            totalDocuments: 0,
            totalStorageUsed: "0 GB"
        };
    }
}

export async function getAllMedia(): Promise<MediaItem[]> {
    try {
        const mediaItems = await prisma.media.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return mediaItems.map((item: Media) => ({
            id: String(item.id),
            filename: item.filename,
            originalName: item.originalName,
            mimeType: item.mimeType,
            size: item.size,
            path: item.path,
            altText: item.altText || undefined, // explicit undefined for optional
            createdAt: item.createdAt.toISOString()
        }));
    } catch (error) {
        console.error("Error fetching media:", error);
        return [];
    }
}