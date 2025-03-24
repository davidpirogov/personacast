import { NextRequest, NextResponse } from "next/server";
import { heroImagesService } from "@/services/hero-images-service";
import { filesService } from "@/services/files-service";
export async function GET(request: NextRequest, context: { params: { id: string } }) {
    const params = await context.params;

    const fileMetadata = await filesService.get(params.id);
    if (!fileMetadata) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const heroImage = await heroImagesService.getByFileId(fileMetadata.id);
    if (!heroImage) {
        return NextResponse.json({ error: "Hero image not found" }, { status: 404 });
    }

    // Get optimized image URLs for the hero image
    const optimizedUrls = await heroImagesService.getOptimizedImageUrls(fileMetadata.id);
    if (!optimizedUrls) {
        return NextResponse.json({ error: "Failed to get optimized images" }, { status: 500 });
    }

    // Return both hero image data and optimized URLs
    return NextResponse.json({
        ...heroImage,
        ...optimizedUrls
    });
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
    try {
        const params = await context.params;

        await heroImagesService.delete(parseInt(params.id));

        return new NextResponse("Hero image deleted", { status: 200 });
    } catch (error) {
        console.error("Error deleting hero image:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
