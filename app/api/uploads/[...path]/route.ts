import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Serve uploaded files dynamically (for standalone mode)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathSegments } = await params;
        const filename = pathSegments.join("/");

        // Security: Only allow files from uploads directory
        if (filename.includes("..") || filename.startsWith("/")) {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public/imgs/uploads", filename);

        const file = await readFile(filePath);

        // Determine content type
        const ext = path.extname(filename).toLowerCase();
        const contentTypes: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".svg": "image/svg+xml",
            ".mp3": "audio/mpeg",
            ".wav": "audio/wav",
            ".mp4": "video/mp4",
        };

        const contentType = contentTypes[ext] || "application/octet-stream";

        return new NextResponse(file, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
}
