import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { applyRateLimiting } from "@/middleware/rate-limit";
import { handleAuthentication, addAuthHeaders, addMiddlewareHeaders } from "@/middleware/authentication";
import { handleStaticRoutes } from "@/middleware/static-routes";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/api/cached", "/api/health"];

function isPublicRoute(path: string): boolean {
    return PUBLIC_ROUTES.some((route) => path.startsWith(route));
}

// Export the middleware function
export default async function middleware(req: NextRequest) {
    const responseHeaders: Record<string, string> = {};
    const edgeToken = req.headers.get("x-edge-token");
    const isEdgeRuntime = req.headers.get("x-edge-runtime");
    const startTime = Date.now();

    if (isEdgeRuntime === "1" && edgeToken === process.env.AUTH_EDGE_TOKEN) {
        // This is an edge runtime request, so we can skip rate limiting and other checks
        // because they have been done at the edge runtime
        return NextResponse.next();
    }

    // The rate limit middleware returns a response and headers because we need
    // to know how many requests are left and the rate limit headers
    const rateLimitResponse = await applyRateLimiting(req);
    if (rateLimitResponse.status === 429) {
        return NextResponse.json(rateLimitResponse.body, {
            status: rateLimitResponse.status,
            headers: responseHeaders,
        });
    } else if (rateLimitResponse.headers !== null) {
        rateLimitResponse.headers?.forEach((value, key) => {
            if (key.toLowerCase().startsWith("x-ratelimit")) {
                responseHeaders[key] = value;
            }
        });
    }

    const staticResponse = await handleStaticRoutes(req);
    if (staticResponse) {
        addMiddlewareHeaders(staticResponse, new Headers(responseHeaders));
        return staticResponse;
    }

    // Skip authentication for public routes
    if (!isPublicRoute(req.nextUrl.pathname)) {
        const authResponse = await handleAuthentication(req);
        if (authResponse) {
            // Copy headers to the auth response
            addMiddlewareHeaders(authResponse, new Headers(responseHeaders));
            return authResponse;
        }
    }

    const response = NextResponse.next();

    const session = await auth();
    if (session) {
        addAuthHeaders(response, session);
    }

    response.headers.set("x-process-time", `${Date.now() - startTime}ms`);

    // Add all the headers collected through the middleware chains
    // into a header object for the response
    addMiddlewareHeaders(response, new Headers(responseHeaders));

    return response;
}

// Configure matcher to run middleware on all routes except static assets
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - /health (health check endpoint)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.json (PWA manifest file)
         */
        "/((?!api/health|_next/static|_next/image|favicon.ico|manifest.json).*)",
    ],
};
