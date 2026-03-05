"use server";

import { verifyAdmin } from "@/actions/admin-auth";
import { prisma } from "@/lib/db";
import { uploadAsset } from "@/lib/upload-service";

export async function uploadImage(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    if (!(file instanceof File) || file.size === 0) {
        return { success: false, error: "No file provided" };
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("audio/")) {
        return { success: false, error: "File must be an image or audio" };
    }

    if (file.size > 20 * 1024 * 1024) {
        return { success: false, error: "File size must be less than 20MB" };
    }

    try {
        const uploaded = await uploadAsset({
            file,
            purpose: file.type.startsWith("audio/") ? "article-audio" : "editor-image",
            allowedMimePrefixes: ["image/", "audio/"],
            maxSizeBytes: 20 * 1024 * 1024,
            localPathPrefix: "/api/uploads",
        });

        // Store in database
        try {
            await prisma.media.create({
                data: {
                    filename: uploaded.filename,
                    originalName: file.name,
                    mimeType: file.type,
                    size: file.size,
                    path: uploaded.url
                }
            });
        } catch (dbError) {
            console.warn("Failed to store media in database:", dbError);
            // Continue anyway - file is uploaded
        }

        return {
            success: true,
            url: uploaded.url,
            filename: uploaded.filename
        };
    } catch (error) {
        console.error("Upload failed:", error);
        return { success: false, error: error instanceof Error ? error.message : "Upload failed" };
    }
}

export async function deleteMedia(filename: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.media.deleteMany({
            where: { filename }
        });

        return { success: true };
    } catch (error) {
        console.error("Delete failed:", error);
        return { success: false, error: "Delete failed" };
    }
}

export async function deleteMediaById(id: number, filename?: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        if (filename) {
            await prisma.media.deleteMany({
                where: { id, filename }
            });
        } else {
            await prisma.media.delete({
                where: { id }
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Delete failed:", error);
        return { success: false, error: "Delete failed" };
    }
}

export async function getMediaLibrary() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        const media = await prisma.media.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, media };
    } catch (error) {
        console.error("Failed to fetch media:", error);
        return { success: false, error: "Failed to fetch media", media: [] };
    }
}

// Export aliases for compatibility
export { getMediaLibrary as getImages };
export { deleteMediaById as deleteImage };
