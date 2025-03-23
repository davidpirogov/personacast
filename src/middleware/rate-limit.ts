import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export interface RateLimitResponse {
    status: number;
    headers: Headers | null;
    body: string | null;
    shouldContinue: boolean;
}

// Rate limiting function
export async function applyRateLimiting(req: NextRequest): Promise<RateLimitResponse> {
    try {
        // Skip rate limiting for the rate limit API itself
        if (req.nextUrl.pathname === "/api/rate-limit") {
            return { status: 200, headers: null, body: null, shouldContinue: true };
        }

        // Construct the full URL using the request's origin
        const origin = req.nextUrl.origin;
        const rateLimitUrl = new URL("/api/rate-limit", origin);
        const rateLimit = await fetch(rateLimitUrl, {
            method: "POST",
            body: JSON.stringify({
                method: req.method,
                path: req.nextUrl.pathname,
            }),
            headers: {
                "x-forwarded-for": req.headers.get("x-forwarded-for") || "",
                "x-real-ip": req.headers.get("x-real-ip") || "",
                "x-edge-runtime": "1", // Identify as Edge runtime
                "x-edge-token": process.env.AUTH_EDGE_TOKEN || "",
            },
            credentials: "same-origin",
        });

        const data = await rateLimit.json();
        const headerObj: Record<string, string> = {};
        rateLimit.headers.forEach((value, key) => {
            if (key.toLowerCase().startsWith("x-ratelimit")) {
                headerObj[key] = value;
            }
        });

        return {
            status: data.allowed ? 200 : 429,
            headers: new Headers(headerObj),
            body: data,
            shouldContinue: data.allowed,
        };
    } catch (error) {
        console.error("Rate limiting failed:", error);
        return { status: 429, headers: null, body: null, shouldContinue: false };
    }
}
