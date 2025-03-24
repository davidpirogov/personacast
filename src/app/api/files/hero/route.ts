import { NextRequest, NextResponse } from "next/server";
import { filesService } from "@/services/files-service";
import { heroImagesService } from "@/services/hero-images-service";
import { HeroImageCreateRequest, heroImageCreateRequestSchema } from "@/schemas/hero-images/schema";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.json();
        const requestedFileId = formData.fileId as string;

        if (!requestedFileId) {
            return NextResponse.json({ error: "No file id specified" }, { status: 400 });
        }

        const fileMetadata = await filesService.get(requestedFileId);
        if (!fileMetadata) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        if (!fileMetadata.mimeType.startsWith("image/")) {
            return NextResponse.json({ error: "File is not an image" }, { status: 400 });
        }

        let validatedFormData: HeroImageCreateRequest;
        try {
            validatedFormData = heroImageCreateRequestSchema.parse(formData);
        } catch (error) {
            console.error("Error parsing hero image create request:", error);
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const heroImage = await heroImagesService.create({
            fileId: fileMetadata.id,
            name: validatedFormData.name,
            description: validatedFormData.description,
            urlTo: validatedFormData.urlTo,
            podcastId: validatedFormData.podcastId,
            episodeId: validatedFormData.episodeId,
        });

        return NextResponse.json(heroImage);
    } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json({ error: "Error processing image" }, { status: 500 });
    }
}
