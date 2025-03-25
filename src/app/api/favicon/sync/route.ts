import { faviconService } from "@/services/favicon-service";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to synchronize favicon and manifest settings
 * POST /api/favicon/sync
 */
export async function POST(request: NextRequest) {
    try {
        await faviconService.syncWithSiteSettings();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error syncing favicon settings:", error);
        return NextResponse.json({ error: "Failed to sync favicon settings" }, { status: 500 });
    }
}
