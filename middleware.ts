
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const forwardedHost = requestHeaders.get("x-forwarded-host");

    // Fix LiteSpeed duplicate headers (e.g. "thewisdomia.com, thewisdomia.com")
    let modified = false;

    if (forwardedHost && forwardedHost.includes(",")) {
        const firstHost = forwardedHost.split(",")[0].trim();
        requestHeaders.set("x-forwarded-host", firstHost);
        modified = true;
    }

    const origin = requestHeaders.get("origin");
    if (origin && origin.includes(",")) {
        const firstOrigin = origin.split(",")[0].trim();
        requestHeaders.set("origin", firstOrigin);
        modified = true;
    }

    if (modified) {
        // Re-create response with sanitized headers
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};
