"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAdmin } from "@/actions/admin-auth";
import { prisma } from "@/lib/db";

export async function uploadImage(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
        return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("audio/")) {
        return { success: false, error: "File must be an image or audio" };
    }

    // Validate file size (max 20MB for audio support)
    if (file.size > 20 * 1024 * 1024) {
        return { success: false, error: "File size must be less than 20MB" };
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
        const filename = `${timestamp}-${originalName}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public/imgs/uploads");
        await mkdir(uploadDir, { recursive: true });

        // Write file
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Use API route for serving (works in standalone mode)
        const apiPath = `/api/uploads/${filename}`;

        // Store in database
        try {
            await prisma.media.create({
                data: {
                    filename,
                    originalName: file.name,
                    mimeType: file.type,
                    size: file.size,
                    path: apiPath
                }
            });
        } catch (dbError) {
            console.warn("Failed to store media in database:", dbError);
            // Continue anyway - file is uploaded
        }

        return {
            success: true,
            url: apiPath,
            filename
        };
    } catch (error) {
        console.error("Upload failed:", error);
        return { success: false, error: "Upload failed" };
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