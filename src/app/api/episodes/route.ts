import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({ episodes: ["list", "of", "episodes"] });
    } catch (error) {
        console.error("System error getting a list of episodes:", error);
        return NextResponse.json({ error: "Failed to get episodes" }, { status: 500 });
    }
}
