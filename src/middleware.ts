import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isRoleAnAuthenticatedRole } from "@/lib/database/user";

// Export the middleware function
export default async function middleware(req: NextRequest) {
    // Get the current path
    const { pathname } = req.nextUrl;

    // Always allow auth-related paths, static assets, and session checks
    if (
        pathname.startsWith("/api/auth") ||
        pathname === "/" ||
        pathname.startsWith("/_next") ||
        pathname === "/api/auth/session"
    ) {
        return NextResponse.next();
    }

    const session = await auth();

    // Handle API routes
    if (pathname.startsWith("/api/")) {
        const bearerToken = req.headers.get("Authorization")?.split(" ")[1];

        // If there's a bearer token, validate it as an API client
        if (bearerToken) {
            try {
                const validateResponse = await fetch(new URL("/api/auth/validate-token", req.url), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: bearerToken }),
                });

                const { valid } = await validateResponse.json();

                if (!valid) {
                    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                }

                // If token is valid, allow the request without checking session
                return NextResponse.next();
            } catch (error) {
                console.error("Error validating token:", error);
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        // If no bearer token, check for session-based auth
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.next();
    }

    // For non-API routes, require session authentication
    const isAuthenticated = isRoleAnAuthenticatedRole(session?.user?.role);

    // Redirect to home if not authenticated with correct role
    if (!isAuthenticated) {
        const signInUrl = new URL("/", req.url);
        return NextResponse.redirect(signInUrl);
    }

    // Clone the response to add session header
    const response = NextResponse.next();

    // Add session information to response headers
    response.headers.set("x-auth-status", "authenticated");
    if (session?.user?.role) {
        response.headers.set("x-auth-role", session.user.role);
    }

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
         */
        "/((?!api/health|_next/static|_next/image|favicon.ico).*)",
    ],
};
