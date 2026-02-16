import { NextRequest, NextResponse } from "next/server";
import { open, readFile, stat } from "fs/promises";
import path from "path";

function buildResponseHeaders(
    contentType: string,
    cacheControl: string,
    filename: string,
    isSvg: boolean,
    extraHeaders: Record<string, string> = {}
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

    return { ...headers, ...extraHeaders };
}

function parseRangeHeader(
    rangeHeader: string,
    fileSize: number
): { start: number; end: number } | null {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
    if (!match) return null;

    const [, startRaw, endRaw] = match;
    let start: number;
    let end: number;

    if (!startRaw && !endRaw) {
        return null;
    }

    if (!startRaw) {
        const suffixLength = Number(endRaw);
        if (!Number.isFinite(suffixLength) || suffixLength <= 0) return null;
        start = Math.max(fileSize - suffixLength, 0);
        end = fileSize - 1;
    } else {
        start = Number(startRaw);
        end = endRaw ? Number(endRaw) : fileSize - 1;
    }

    if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
    if (start < 0 || start >= fileSize) return null;
    if (end < start) return null;

    return {
        start,
        end: Math.min(end, fileSize - 1),
    };
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
        const isMedia =
            contentType.startsWith("audio/") || contentType.startsWith("video/");
        const rangeHeader = request.headers.get("range");

        try {
            const fileStats = await stat(filePath);
            const fileSize = fileStats.size;
            const isSvg = ext === ".svg";

            if (isMedia && rangeHeader) {
                const parsedRange = parseRangeHeader(rangeHeader, fileSize);
                if (!parsedRange) {
                    return new NextResponse("Requested Range Not Satisfiable", {
                        status: 416,
                        headers: {
                            "Content-Range": `bytes */${fileSize}`,
                            "Accept-Ranges": "bytes",
                        },
                    });
                }

                const { start, end } = parsedRange;
                const chunkSize = end - start + 1;
                const fileHandle = await open(filePath, "r");

                try {
                    const chunk = Buffer.alloc(chunkSize);
                    await fileHandle.read(chunk, 0, chunkSize, start);

                    return new NextResponse(chunk, {
                        status: 206,
                        headers: buildResponseHeaders(
                            contentType,
                            "public, max-age=31536000, immutable",
                            filename,
                            isSvg,
                            {
                                "Accept-Ranges": "bytes",
                                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                                "Content-Length": String(chunkSize),
                            }
                        ),
                    });
                } finally {
                    await fileHandle.close();
                }
            }

            const file = await readFile(filePath);
            return new NextResponse(file, {
                headers: buildResponseHeaders(
                    contentType,
                    "public, max-age=31536000, immutable",
                    filename,
                    isSvg,
                    {
                        "Content-Length": String(fileSize),
                        ...(isMedia ? { "Accept-Ranges": "bytes" } : {}),
                    }
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
                        const fetchHeaders: HeadersInit = {};
                        if (rangeHeader) {
                            fetchHeaders.Range = rangeHeader;
                        }
                        const remoteRes = await fetch(fetchUrl, {
                            headers: Object.keys(fetchHeaders).length ? fetchHeaders : undefined,
                            signal: AbortSignal.timeout(5000),
                        });
                        if (remoteRes.ok) {
                            const remoteContentType = remoteRes.headers.get("content-type") || contentType;
                            const isSvg =
                                ext === ".svg" ||
                                remoteContentType.toLowerCase().startsWith("image/svg+xml");
                            const responseHeaders: Record<string, string> = {};
                            const passthroughHeaders: Array<[string, string]> = [
                                ["accept-ranges", "Accept-Ranges"],
                                ["content-range", "Content-Range"],
                                ["content-length", "Content-Length"],
                            ];

                            for (const [sourceName, targetName] of passthroughHeaders) {
                                const headerValue = remoteRes.headers.get(sourceName);
                                if (headerValue) {
                                    responseHeaders[targetName] = headerValue;
                                }
                            }

                            return new NextResponse(remoteRes.body, {
                                status: remoteRes.status,
                                headers: buildResponseHeaders(
                                    remoteContentType,
                                    "public, max-age=3600",
                                    filename,
                                    isSvg,
                                    responseHeaders
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
