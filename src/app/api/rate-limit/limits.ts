import { RateLimiterRedis } from "rate-limiter-flexible";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRedisClient } from "@/lib/redis";

const redis = getRedisClient();

export interface RejectReason {
    msBeforeNext: number;
    points: number;
}

// Helper to match route patterns
export function matchRoute(pathname: string, pattern: string): boolean {
    return pattern.endsWith("/") ? pathname.startsWith(pattern) : pathname === pattern;
}

// Helper to get client IP
export function getClientIP(req: NextRequest): string {
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    return req.headers.get("x-real-ip") || "127.0.0.1";
}

// Configure rate limiters
export const globalLimiter = new RateLimiterRedis({
    storeClient: redis,
    points: Number(process.env.RATE_LIMIT_GLOBAL_POINTS) || 20, // Number of points
    duration: Number(process.env.RATE_LIMIT_GLOBAL_DURATION) || 60, // Per 60 seconds
    keyPrefix: "ratelimit:global",
});

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type RouteLimits = {
    [key: string]: {
        [K in HttpMethod]?: RateLimiterRedis;
    };
};

// Route-specific rate limits
export const routeLimits: RouteLimits = {
    "/api/": {
        POST: new RateLimiterRedis({
            storeClient: redis,
            points: Number(process.env.RATE_LIMIT_ROUTE_POINTS) || 10, // Number of points
            duration: Number(process.env.RATE_LIMIT_ROUTE_DURATION) || 60, // Per 60 seconds
            keyPrefix: "ratelimit:api",
        }),
    },
};
