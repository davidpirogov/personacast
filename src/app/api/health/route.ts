import { NextResponse } from "next/server";
import { healthCheck } from "@/lib/database/utils";
import { TimeoutError } from "@/lib/database/errors";

export async function GET() {
    try {
        await healthCheck();
        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        let errorMessage = "Unknown error";
        if (error instanceof TimeoutError) {
            errorMessage = error.message;
        } else {
            errorMessage = error instanceof Error ? error.message : String(error);
        }
        return new NextResponse(JSON.stringify({ success: false, error: errorMessage }), { status: 503 });
    }
}
