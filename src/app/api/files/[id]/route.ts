import { NextRequest, NextResponse } from "next/server";
import { InvalidPathError, FileNotFoundError } from "../safe-path";
import { filesService } from "@/services/files-service";
import { readdir, unlink } from "fs/promises";
import { rmdir } from "fs/promises";
import { join } from "path";
import { v4 } from "uuid";
import { isValidUUID } from "@/lib/utils";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
    try {
        // Get and await params
        const params = await context.params;

        // Get file metadata
        const fileMetadata = await filesService.get(params.id);

        if (!fileMetadata) {
            return new NextResponse("File not found", { status: 404 });
        }

        return new NextResponse(JSON.stringify(fileMetadata), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Error serving file:", error);

        if (error instanceof FileNotFoundError) {
            return new NextResponse("File not found", { status: 404 });
        }

        if (error instanceof InvalidPathError) {
            return new NextResponse("Invalid path", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
    try {
        const params = await context.params;

        // Validate that the ID is a valid UUID
        if (!isValidUUID(params.id)) {
            return new NextResponse("Invalid file identifier", { status: 400 });
        }

        await filesService.delete(params.id);

        return new NextResponse("File deleted", { status: 200 });
    } catch (error) {
        console.error("Error deleting file:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
