import { ApiClientsService } from "@/services/api-clients-service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "API client ID is required" }, { status: 400 });
        }

        await new ApiClientsService().deleteClient(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("System error deleting API client:", error);
        return NextResponse.json({ error: "Failed to delete API client" }, { status: 500 });
    }
}
