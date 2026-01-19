
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const forwardedHost = requestHeaders.get("x-forwarded-host");

    // Log all headers for debugging
    console.log("MW ALL HEADERS:", JSON.stringify(Object.fromEntries(requestHeaders.entries())));
    console.log("MW CHECK:", { url: request.url, forwardedHost });

    // Fix LiteSpeed duplicate headers (e.g. "thewisdomia.com, thewisdomia.com")
    if (forwardedHost && forwardedHost.includes(",")) {
        console.log("MW FIXING HOST:", forwardedHost);
        const firstHost = forwardedHost.split(",")[0].trim();
        requestHeaders.set("x-forwarded-host", firstHost);

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
