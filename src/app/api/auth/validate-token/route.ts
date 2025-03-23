import { prisma } from "@/lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getClientIP } from "../../rate-limit/limits";

export async function POST(request: NextRequest) {
    try {
        // Verify request is from our own Edge runtime
        const isEdgeRuntime = request.headers.get("x-edge-runtime");
        const edgeToken = request.headers.get("x-edge-token");

        if (!isEdgeRuntime || edgeToken !== process.env.AUTH_EDGE_TOKEN) {
            console.error(
                "Validate Bearer Token request rejected - AUTH_EDGE_TOKEN mismatch. Client IP:",
                getClientIP(request),
            );
            return NextResponse.json({ valid: false, error: "Forbidden" }, { status: 403 });
        }

        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ valid: false }, { status: 400 });
        }

        const apiClient = await prisma.apiClient.findUnique({
            where: {
                token,
                isActive: true,
            },
        });

        return NextResponse.json({ valid: !!apiClient });
    } catch (error) {
        console.error("Error validating token:", error);
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}
