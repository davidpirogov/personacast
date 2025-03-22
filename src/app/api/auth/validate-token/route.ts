import { prisma } from "@/lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
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
