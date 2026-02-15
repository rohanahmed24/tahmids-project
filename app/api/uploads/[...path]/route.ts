import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

function buildResponseHeaders(
    contentType: string,
    cacheControl: string,
    filename: string,
    isSvg: boolean
) {
    const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
        "X-Content-Type-Options": "nosniff",
    };

    if (isSvg) {
        const safeFilename = path.basename(filename).replace(/"/g, "");
        headers["Content-Disposition"] = `attachment; filename="${safeFilename}"`;
        headers["Content-Security-Policy"] = "default-src 'none'; sandbox";
    }

    return headers;
}

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

        try {
            const file = await readFile(filePath);
            const isSvg = ext === ".svg";

            return new NextResponse(file, {
                headers: buildResponseHeaders(
                    contentType,
                    "public, max-age=31536000, immutable",
                    filename,
                    isSvg
                ),
            });
        } catch {
            const remoteBase = process.env.NEXT_PUBLIC_UPLOADS_BASE_URL?.replace(/\/$/, "");
            if (remoteBase) {
                let fetchUrl: string | undefined;
                try {
                    const requestUrl = new URL(request.url);
                    const remoteUrl = new URL(remoteBase);
                    if (remoteUrl.host !== requestUrl.host) {
                        const encodedPath = pathSegments.map(encodeURIComponent).join("/");
                        fetchUrl = `${remoteBase}/imgs/uploads/${encodedPath}`;
                        const remoteRes = await fetch(fetchUrl, {
                            signal: AbortSignal.timeout(5000),
                        });
                        if (remoteRes.ok) {
                            const arrayBuffer = await remoteRes.arrayBuffer();
                            const remoteContentType = remoteRes.headers.get("content-type") || contentType;
                            const isSvg =
                                ext === ".svg" ||
                                remoteContentType.toLowerCase().startsWith("image/svg+xml");
                            return new NextResponse(Buffer.from(arrayBuffer), {
                                headers: buildResponseHeaders(
                                    remoteContentType,
                                    "public, max-age=3600",
                                    filename,
                                    isSvg
                                ),
                            });
                        }
                    }
                } catch (error) {
                    console.warn("Remote upload fetch failed:", { fetchUrl, error });
                }
            }

            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
    } catch {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
}
