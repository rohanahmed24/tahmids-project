
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const forwardedHost = requestHeaders.get("x-forwarded-host");
    const pathname = request.nextUrl.pathname;

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

    // Check if route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        const session = await auth();

        if (!session?.user) {
            const signInUrl = new URL("/signin", request.url);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }
    }

    if (modified) {
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|imgs|public).*)"],
};
