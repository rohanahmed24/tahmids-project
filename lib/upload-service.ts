import "server-only";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

type UploadPurpose = "article-cover" | "article-audio" | "article-video" | "editor-image" | "media-library";
type LocalPathPrefix = "/api/uploads" | "/imgs/uploads";

interface UploadAssetOptions {
    file: File;
    purpose: UploadPurpose;
    allowedMimePrefixes: readonly string[];
    maxSizeBytes: number;
    localPathPrefix: LocalPathPrefix;
}

interface UploadAssetResult {
    filename: string;
    key: string;
    url: string;
    storage: "bunny" | "local";
}

interface BunnyConfig {
    storageZone: string;
    accessKey: string;
    region: string | null;
    cdnBaseUrl: string;
    basePath: string;
}

const MIME_EXTENSION_MAP: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "audio/ogg": ".ogg",
    "audio/mp4": ".m4a",
    "audio/x-m4a": ".m4a",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/ogg": ".ogv",
    "video/quicktime": ".mov",
};

const PURPOSE_PATH: Record<UploadPurpose, string> = {
    "article-cover": "articles/covers",
    "article-audio": "articles/audio",
    "article-video": "articles/video",
    "editor-image": "articles/content",
    "media-library": "media/library",
};

function normalizeEnvValue(value: string | undefined): string | null {
    const trimmed = (value || "").trim();
    return trimmed.length > 0 ? trimmed : null;
}

function getBunnyConfig(): BunnyConfig | null {
    const storageZone = normalizeEnvValue(process.env.BUNNY_STORAGE_ZONE);
    const accessKey = normalizeEnvValue(process.env.BUNNY_STORAGE_ACCESS_KEY);
    const cdnBaseUrlRaw = normalizeEnvValue(process.env.BUNNY_CDN_BASE_URL);

    if (!storageZone && !accessKey && !cdnBaseUrlRaw) {
        return null;
    }

    if (!storageZone || !accessKey || !cdnBaseUrlRaw) {
        throw new Error("Incomplete Bunny configuration. Set BUNNY_STORAGE_ZONE, BUNNY_STORAGE_ACCESS_KEY, and BUNNY_CDN_BASE_URL.");
    }

    let cdnBaseUrl: string;
    try {
        const parsed = new URL(cdnBaseUrlRaw);
        if (parsed.protocol !== "https:") {
            throw new Error("BUNNY_CDN_BASE_URL must use https.");
        }
        cdnBaseUrl = parsed.toString().replace(/\/+$/, "");
    } catch {
        throw new Error("Invalid BUNNY_CDN_BASE_URL.");
    }

    const region = normalizeEnvValue(process.env.BUNNY_STORAGE_REGION);
    const basePath = normalizeEnvValue(process.env.BUNNY_STORAGE_BASE_PATH) || "uploads";

    return {
        storageZone,
        accessKey,
        region,
        cdnBaseUrl,
        basePath,
    };
}

function isAllowedMimeType(mimeType: string, allowedMimePrefixes: readonly string[]): boolean {
    return allowedMimePrefixes.some((prefix) => mimeType.startsWith(prefix));
}

function sanitizeBaseName(fileName: string): string {
    const extension = path.extname(fileName);
    const nameWithoutExtension = extension ? fileName.slice(0, -extension.length) : fileName;
    const sanitized = nameWithoutExtension
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-+|-+$/g, "");

    return sanitized || "file";
}

function resolveExtension(fileName: string, mimeType: string): string {
    const extFromName = path.extname(fileName).toLowerCase();
    if (/^\.[a-z0-9]{1,8}$/.test(extFromName)) {
        return extFromName;
    }

    return MIME_EXTENSION_MAP[mimeType] || "";
}

function buildObjectKey(purpose: UploadPurpose, filename: string, basePath: string): string {
    const now = new Date();
    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const normalizedBasePath = basePath.replace(/^\/+|\/+$/g, "");
    return [normalizedBasePath, PURPOSE_PATH[purpose], year, month, filename].join("/");
}

function encodeObjectKey(key: string): string {
    return key
        .split("/")
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}

function buildBunnyStorageHost(region: string | null): string {
    if (!region) return "storage.bunnycdn.com";
    return `${region}.storage.bunnycdn.com`;
}

async function uploadToBunny(config: BunnyConfig, key: string, file: File): Promise<void> {
    const host = buildBunnyStorageHost(config.region);
    const encodedKey = encodeObjectKey(key);
    const uploadUrl = `https://${host}/${encodeURIComponent(config.storageZone)}/${encodedKey}`;
    const body = Buffer.from(await file.arrayBuffer());

    const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            AccessKey: config.accessKey,
            "Content-Type": file.type || "application/octet-stream",
        },
        body,
    });

    if (!response.ok) {
        const message = await response.text().catch(() => "");
        console.error("Bunny upload request failed.", {
            status: response.status,
            statusText: response.statusText,
            bodyPreview: message.slice(0, 200),
        });
        throw new Error(`Bunny upload failed (${response.status}).`);
    }
}

async function uploadLocally(filename: string, file: File, localPathPrefix: LocalPathPrefix): Promise<string> {
    const uploadDir = path.join(process.cwd(), "public/imgs/uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
    return `${localPathPrefix}/${filename}`;
}

export async function uploadAsset(options: UploadAssetOptions): Promise<UploadAssetResult> {
    const { file, purpose, allowedMimePrefixes, maxSizeBytes, localPathPrefix } = options;

    if (!file || file.size === 0) {
        throw new Error("No file provided.");
    }

    if (!isAllowedMimeType(file.type, allowedMimePrefixes)) {
        throw new Error(`Invalid file type: ${file.type || "unknown"}.`);
    }

    if (file.size > maxSizeBytes) {
        throw new Error(`File size exceeds ${Math.floor(maxSizeBytes / (1024 * 1024))}MB.`);
    }

    const baseName = sanitizeBaseName(file.name);
    const extension = resolveExtension(file.name, file.type);
    const filename = `${Date.now()}-${randomUUID()}-${baseName}${extension}`;
    const bunnyConfig = getBunnyConfig();

    if (bunnyConfig) {
        const key = buildObjectKey(purpose, filename, bunnyConfig.basePath);
        await uploadToBunny(bunnyConfig, key, file);
        return {
            filename,
            key,
            url: `${bunnyConfig.cdnBaseUrl}/${encodeObjectKey(key)}`,
            storage: "bunny",
        };
    }

    const localUrl = await uploadLocally(filename, file, localPathPrefix);
    return {
        filename,
        key: filename,
        url: localUrl,
        storage: "local",
    };
}

export function isBunnyConfigured(): boolean {
    try {
        return Boolean(getBunnyConfig());
    } catch {
        return false;
    }
}
