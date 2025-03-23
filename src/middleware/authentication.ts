import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isRoleAnAuthenticatedRole } from "@/lib/database/user";
import { Session } from "next-auth";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/podcasts", "/auth/signin", "/auth/error"];

export async function handleAuthentication(req: NextRequest): Promise<NextResponse | null> {
    const { pathname } = req.nextUrl;
    const session = await auth();

    // Handle API routes
    if (pathname.startsWith("/api/")) {
        const bearerToken = req.headers.get("Authorization")?.split(" ")[1];

        // If there's a bearer token, validate it as an API client
        if (bearerToken) {
            try {
                const origin = req.nextUrl.origin;
                const validateUrl = new URL("/api/auth/validate-token", origin);
                const validateResponse = await fetch(validateUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-real-ip": req.headers.get("x-real-ip") || "",
                        "x-edge-runtime": "1", // Identify as Edge runtime
                        "x-edge-token": process.env.AUTH_EDGE_TOKEN || "",
                    },
                    body: JSON.stringify({ token: bearerToken }),
                });

                const { valid } = await validateResponse.json();
                if (!valid) {
                    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                }

                // If token is valid, allow the request without checking session
                return null;
            } catch (error) {
                console.error("Error validating token:", error);
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        // If no bearer token, check for session-based auth
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return null;
    }

    // Allow access to public routes without authentication
    if (PUBLIC_ROUTES.includes(pathname)) {
        return null;
    }

    // For non-API and non-public routes, require session authentication
    const isAuthenticated = isRoleAnAuthenticatedRole(session?.user?.role);

    // Redirect to home if not authenticated with correct role
    if (!isAuthenticated) {
        const signInUrl = new URL("/", req.url);
        console.log("Redirecting to sign in");
        return NextResponse.redirect(signInUrl);
    }

    return null;
}

export function addAuthHeaders(response: NextResponse, session: Session | null): void {
    // Add session information to response headers
    response.headers.set("x-auth-status", "authenticated");
    if (session?.user?.role) {
        response.headers.set("x-auth-role", session.user.role);
    }
}

export function addMiddlewareHeaders(response: NextResponse, headers: Headers): void {
    headers.forEach((value, key) => {
        if (response.headers.has(key)) {
            console.warn(`Overriding existing header value for '${key}' with '${value}'`);
        }
        response.headers.set(key, value);
    });
}
