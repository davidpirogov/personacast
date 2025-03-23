import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { getClientIP, globalLimiter, routeLimits, RejectReason } from "@/app/api/rate-limit/limits";

export const runtime = "nodejs"; // Force Node.js runtime

export async function POST(request: NextRequest) {
    // Verify request is from our own Edge runtime
    const isEdgeRuntime = request.headers.get("x-edge-runtime");
    const edgeToken = request.headers.get("x-edge-token");

    if (!isEdgeRuntime || edgeToken !== process.env.AUTH_EDGE_TOKEN) {
        console.error(
            "Rate limit request rejected - AUTH_EDGE_TOKEN mismatch. Client IP:",
            getClientIP(request),
        );
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const ip = getClientIP(request);
        const method = request.method as keyof (typeof routeLimits)[string];
        const pathname = (await request.json())?.path;

        try {
            await globalLimiter.consume(ip);
        } catch (error) {
            return NextResponse.json({ allowed: false, error: "Too Many Requests" }, { status: 429 });
        }

        try {
            const routeLimiter = routeLimits[pathname]?.[method];
            if (routeLimiter) {
                await routeLimiter.consume(ip);
            }
        } catch (error) {
            const rejectReason = error as RejectReason;
            return NextResponse.json(
                { allowed: false, error: "Too Many Requests" },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(rejectReason.msBeforeNext),
                        "X-RateLimit-Limit": String(rejectReason.points),
                        "X-RateLimit-Remaining": "0",
                    },
                },
            );
        }

        // Get the rate limit info for the current route
        const routeLimiter = routeLimits[pathname]?.[method];
        const points = routeLimiter?.points || globalLimiter.points;
        const remaining = points - 1; // Decrement by 1 since we just consumed a point

        return NextResponse.json(
            {
                allowed: true,
            },
            {
                status: 200,
                headers: {
                    "X-RateLimit-Limit": String(points),
                    "X-RateLimit-Remaining": String(remaining),
                    "Content-Type": "application/json",
                    "Access-Control-Expose-Headers": "X-RateLimit-Limit, X-RateLimit-Remaining",
                },
            },
        );
    } catch (error) {
        console.error("Rate limiting failed:", error);
        // On error, allow the requestuest but indicate rate limiting is unavailable
        return NextResponse.json({ allowed: true, error: "Rate limiting unavailable" });
    }
}
