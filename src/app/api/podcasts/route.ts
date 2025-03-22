import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({ podcasts: ["list", "of", "podcasts"] });
    } catch (error) {
        console.error("System error getting a list of podcasts:", error);
        return NextResponse.json({ error: "Failed to get podcasts" }, { status: 500 });
    }
}
