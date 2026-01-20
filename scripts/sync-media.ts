import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
// import mime from "mime"; // Removed to avoid dependency

const prisma = new PrismaClient();

async function syncMedia() {
    const publicDir = path.join(process.cwd(), "public");
    const imgsDir = path.join(publicDir, "imgs");

    try {
        const files = await fs.readdir(imgsDir);
        console.log(`Found ${files.length} files in ${imgsDir}`);

        for (const filename of files) {
            const filePath = path.join(imgsDir, filename);
            const stats = await fs.stat(filePath);

            if (stats.isDirectory()) continue;

            // Simple mime type detection if mime package is missing
            const ext = path.extname(filename).toLowerCase();
            let mimeType = "application/octet-stream";
            if (['.jpg', '.jpeg'].includes(ext)) mimeType = "image/jpeg";
            else if (['.png'].includes(ext)) mimeType = "image/png";
            else if (['.gif'].includes(ext)) mimeType = "image/gif";
            else if (['.webp'].includes(ext)) mimeType = "image/webp";
            else if (['.svg'].includes(ext)) mimeType = "image/svg+xml";
            else if (['.mp4'].includes(ext)) mimeType = "video/mp4";
            else if (['.pdf'].includes(ext)) mimeType = "application/pdf";

            const urlPath = `/imgs/${filename}`;

            // Check if exists
            const existing = await prisma.media.findFirst({
                where: { filename: filename }
            });

            if (!existing) {
                await prisma.media.create({
                    data: {
                        filename: filename,
                        originalName: filename,
                        mimeType: mimeType,
                        size: stats.size,
                        path: urlPath,
                        altText: filename.split('.')[0].replace(/[-_]/g, ' '),
                        createdAt: stats.birthtime
                    }
                });
                console.log(`Added: ${filename}`);
            } else {
                // Optional: update if needed
                // console.log(`Skipped (already exists): ${filename}`);
            }
        }

        console.log("Media sync complete!");
    } catch (error) {
        console.error("Error syncing media:", error);
    } finally {
        await prisma.$disconnect();
    }
}

syncMedia();
