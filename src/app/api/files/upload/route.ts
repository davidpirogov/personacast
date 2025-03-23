import { NextRequest, NextResponse } from "next/server";
import { filesService } from "@/services/files-service";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const fileMetadata = await filesService.upload(file);

        return NextResponse.json({
            success: true,
            file: fileMetadata,
        });
    } catch (error) {
        console.error("Error processing file upload:", error);
        return NextResponse.json({ error: "Error processing file upload" }, { status: 500 });
    }
}
