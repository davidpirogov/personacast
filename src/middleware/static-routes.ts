import { NextRequest, NextResponse } from "next/server";

export async function handleStaticRoutes(req: NextRequest): Promise<NextResponse | null> {
    const { pathname } = req.nextUrl;

    // High-traffic paths that should be handled first with exact matches
    if (
        pathname === "/" ||
        pathname === "/api/auth/session" ||
        (pathname === "/api/auth/validate-token" && !req.headers.get("x-edge-runtime")) ||
        (pathname === "/api/rate-limit" && !req.headers.get("x-edge-runtime"))
    ) {
        return NextResponse.next();
    }

    // Always allow auth-related paths, static assets
    if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next")) {
        return NextResponse.next();
    }

    return null;
}
