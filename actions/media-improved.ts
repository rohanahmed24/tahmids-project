"use server";

import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { verifyAdmin } from "@/actions/admin-auth";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";

// Types for better type safety
interface MediaUploadResult {
    success: boolean;
    url?: string;
    filename?: string;
    error?: string;
}

interface MediaDeleteResult {
    success: boolean;
    error?: string;
}

interface MediaLibraryResult {
    success: boolean;
    media?: MediaItem[];
    error?: string;
}

interface MediaItem {
    id: number;
    filename: string;
    original_name: string;
    mime_type: string;
    size: number;
    path: string;
    alt_text?: string;
    created_at: string;
}

// Constants for configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png',
    'image/webp', 'image/gif', 'image/svg+xml'
];
const UPLOAD_DIR = "public/imgs/uploads";
const QUERY_LIMIT = 1000; // Prevent large result sets

// Custom error class for better error handling
class MediaError extends Error {
    constructor(
        message: string,
        public code: 'VALIDATION_ERROR' | 'UPLOAD_ERROR' | 'DATABASE_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND',
        public details?: unknown
    ) {
        super(message);
        this.name = 'MediaError';
    }
}

// Utility functions
function validateFile(file: File): void {
    if (!file || file.size === 0) {
        throw new MediaError("No file provided", 'VALIDATION_ERROR');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new MediaError(
            `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
            'VALIDATION_ERROR'
        );
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new MediaError(
            `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
            'VALIDATION_ERROR'
        );
    }
}

function validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
        throw new MediaError("Invalid media ID", 'VALIDATION_ERROR');
    }
}

function validateFilename(filename: string): string {
    if (!filename?.trim()) {
        throw new MediaError("Filename is required", 'VALIDATION_ERROR');
    }
    return filename.trim();
}

function generateSecureFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '');
    const extension = path.extname(sanitizedName);
    const nameWithoutExt = path.basename(sanitizedName, extension);

    return `${timestamp}-${randomSuffix}-${nameWithoutExt}${extension}`;
}

async function validateAuthentication(): Promise<void> {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new MediaError("Unauthorized access", 'UNAUTHORIZED');
    }
}

function handleMediaError(error: unknown): MediaDeleteResult | MediaUploadResult | MediaLibraryResult {
    if (error instanceof MediaError) {
        return { success: false, error: error.message };
    }

    console.error("Unexpected media operation error:", error);
    return { success: false, error: "An unexpected error occurred" };
}

async function cleanupFile(filePath: string): Promise<void> {
    try {
        await unlink(filePath);
    } catch (error) {
        console.warn("Failed to cleanup file:", filePath, error);
    }
}

async function getMediaByIdentifier(id?: number, filename?: string): Promise<MediaItem | null> {
    const db = getDb();

    try {
        if (id) {
            validateId(id);
            const [rows] = await db.query<RowDataPacket[]>(
                'SELECT * FROM media WHERE id = ?',
                [id]
            );
            return rows.length > 0 ? rows[0] as MediaItem : null;
        }

        if (filename) {
            const cleanFilename = validateFilename(filename);
            const [rows] = await db.query<RowDataPacket[]>(
                'SELECT * FROM media WHERE filename = ?',
                [cleanFilename]
            );
            return rows.length > 0 ? rows[0] as MediaItem : null;
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch media:", error);
        return null;
    }
}

function revalidateMediaPaths(): void {
    revalidatePath("/admin/media");
    revalidatePath("/admin/dashboard");
}

// Service class for better organization
export class MediaService {
    async uploadFile(formData: FormData): Promise<MediaUploadResult> {
        try {
            await validateAuthentication();

            const file = formData.get("file") as File;
            validateFile(file);

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate secure filename
            const filename = generateSecureFilename(file.name);

            // Ensure upload directory exists
            const uploadDir = path.join(process.cwd(), UPLOAD_DIR);
            await mkdir(uploadDir, { recursive: true });

            // Write file to disk
            const filePath = path.join(uploadDir, filename);
            await writeFile(filePath, buffer);

            // Store in database
            const db = getDb();
            try {
                await db.query(
                    `INSERT INTO media (filename, original_name, mime_type, size, path) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [filename, file.name, file.type, file.size, `/imgs/uploads/${filename}`]
                );
            } catch (dbError) {
                // Cleanup uploaded file if database insert fails
                await cleanupFile(filePath);
                throw new MediaError("Failed to store media information", 'DATABASE_ERROR', dbError);
            }

            revalidateMediaPaths();

            return {
                success: true,
                url: `/imgs/uploads/${filename}`,
                filename
            };
        } catch (error) {
            console.error("Media upload failed:", {
                filename: (formData.get("file") as File)?.name,
                size: (formData.get("file") as File)?.size,
                type: (formData.get("file") as File)?.type,
                error: error instanceof Error ? error.message : String(error)
            });
            return handleMediaError(error) as MediaUploadResult;
        }
    }

    async deleteFile(filename: string): Promise<MediaDeleteResult> {
        try {
            await validateAuthentication();
            const cleanFilename = validateFilename(filename);

            // Get media info before deletion for cleanup
            const mediaItem = await getMediaByIdentifier(undefined, cleanFilename);
            if (!mediaItem) {
                throw new MediaError("Media file not found", 'NOT_FOUND');
            }

            const db = getDb();

            // Delete from database
            const [result] = await db.query(
                "DELETE FROM media WHERE filename = ?",
                [cleanFilename]
            );

            // Check if deletion was successful
            if (Array.isArray(result) && 'affectedRows' in result && result.affectedRows === 0) {
                throw new MediaError("Media file not found", 'NOT_FOUND');
            }

            // Cleanup file from disk
            const filePath = path.join(process.cwd(), UPLOAD_DIR, cleanFilename);
            await cleanupFile(filePath);

            revalidateMediaPaths();

            return { success: true };
        } catch (error) {
            console.error("Media deletion failed:", {
                filename,
                error: error instanceof Error ? error.message : String(error)
            });
            return handleMediaError(error) as MediaDeleteResult;
        }
    }

    async deleteFileById(id: number, filename?: string): Promise<MediaDeleteResult> {
        try {
            await validateAuthentication();
            validateId(id);

            // Get media info before deletion for cleanup
            const mediaItem = await getMediaByIdentifier(id, filename);
            if (!mediaItem) {
                throw new MediaError("Media file not found", 'NOT_FOUND');
            }

            const db = getDb();

            // Delete from database with appropriate query
            let query: string;
            let params: (string | number)[];

            if (filename) {
                const cleanFilename = validateFilename(filename);
                query = "DELETE FROM media WHERE id = ? AND filename = ?";
                params = [id, cleanFilename];
            } else {
                query = "DELETE FROM media WHERE id = ?";
                params = [id];
            }

            const [result] = await db.query(query, params);

            // Check if deletion was successful
            if (Array.isArray(result) && 'affectedRows' in result && result.affectedRows === 0) {
                throw new MediaError("Media file not found", 'NOT_FOUND');
            }

            // Cleanup file from disk
            const filePath = path.join(process.cwd(), UPLOAD_DIR, mediaItem.filename);
            await cleanupFile(filePath);

            revalidateMediaPaths();

            return { success: true };
        } catch (error) {
            console.error("Media deletion by ID failed:", {
                id,
                filename,
                error: error instanceof Error ? error.message : String(error)
            });
            return handleMediaError(error) as MediaDeleteResult;
        }
    }

    async getLibrary(): Promise<MediaLibraryResult> {
        try {
            await validateAuthentication();

            const db = getDb();
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT id, filename, original_name, mime_type, size, path, alt_text, created_at
                FROM media 
                ORDER BY created_at DESC
                LIMIT ?
            `, [QUERY_LIMIT]);

            return { success: true, media: rows as MediaItem[] };
        } catch (error) {
            console.error("Failed to fetch media library:", error);
            return handleMediaError(error) as MediaLibraryResult;
        }
    }

    async updateAltText(id: number, altText: string): Promise<MediaDeleteResult> {
        try {
            await validateAuthentication();
            validateId(id);

            const db = getDb();
            const [result] = await db.query(
                "UPDATE media SET alt_text = ? WHERE id = ?",
                [altText.trim(), id]
            );

            if (Array.isArray(result) && 'affectedRows' in result && result.affectedRows === 0) {
                throw new MediaError("Media file not found", 'NOT_FOUND');
            }

            revalidateMediaPaths();
            return { success: true };
        } catch (error) {
            console.error("Failed to update alt text:", error);
            return handleMediaError(error) as MediaDeleteResult;
        }
    }

    async getStats(): Promise<{ totalFiles: number; totalSize: string; totalImages: number; totalVideos: number; totalDocuments: number }> {
        try {
            await validateAuthentication();

            const db = getDb();
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT 
                    COUNT(*) as totalFiles,
                    COALESCE(SUM(size), 0) as totalSize,
                    COUNT(CASE WHEN mime_type LIKE 'image/%' THEN 1 END) as totalImages,
                    COUNT(CASE WHEN mime_type LIKE 'video/%' THEN 1 END) as totalVideos,
                    COUNT(CASE WHEN mime_type NOT LIKE 'image/%' AND mime_type NOT LIKE 'video/%' THEN 1 END) as totalDocuments
                FROM media
            `);

            const stats = rows[0];
            const totalSizeGB = (Number(stats?.totalSize) || 0) / (1024 * 1024 * 1024);

            return {
                totalFiles: Number(stats?.totalFiles) || 0,
                totalSize: `${totalSizeGB.toFixed(1)} GB`,
                totalImages: Number(stats?.totalImages) || 0,
                totalVideos: Number(stats?.totalVideos) || 0,
                totalDocuments: Number(stats?.totalDocuments) || 0
            };
        } catch (error) {
            console.error("Failed to get media stats:", error);
            return {
                totalFiles: 0,
                totalSize: "0 GB",
                totalImages: 0,
                totalVideos: 0,
                totalDocuments: 0
            };
        }
    }
}

// Export functions for backward compatibility
const mediaService = new MediaService();

export async function uploadImage(formData: FormData): Promise<MediaUploadResult> {
    return mediaService.uploadFile(formData);
}

export async function deleteMedia(filename: string): Promise<MediaDeleteResult> {
    return mediaService.deleteFile(filename);
}

export async function deleteMediaById(id: number, filename?: string): Promise<MediaDeleteResult> {
    return mediaService.deleteFileById(id, filename);
}

export async function getMediaLibrary(): Promise<MediaLibraryResult> {
    return mediaService.getLibrary();
}

export async function updateMediaAltText(id: number, altText: string): Promise<MediaDeleteResult> {
    return mediaService.updateAltText(id, altText);
}

export async function getMediaStats() {
    return mediaService.getStats();
}

// Export aliases for compatibility
export { getMediaLibrary as getImages };
export { deleteMediaById as deleteImage };