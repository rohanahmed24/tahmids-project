

import { revalidateTag as nextRevalidateTag } from "next/cache";

/**
 * Wrapper for revalidateTag that handles compatibility between Next.js versions.
 * Next.js 16 types require 2 arguments, but Next.js 15 runtime only accepts 1.
 * The remote server runs Next.js 15, so we use this wrapper to suppress type errors.
 */
export function revalidateTag(tag: string): void {
    // Cast to any to handle cross-version compatibility between Next.js 15 and 16
    (nextRevalidateTag as any)(tag);
}
