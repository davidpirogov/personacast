import { NextRequest, NextResponse } from "next/server";
import { filesService } from "@/services/files-service";
import { FileNotFoundError } from "@/app/api/files/safe-path";
import { InvalidPathError } from "@/app/api/files/safe-path";
import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";

// Validate dimensions format (AxB where A and B are positive integers)
function validateDimensions(dimensions: string): { width: number; height: number } | null {
    const match = dimensions.match(/^(\d+)x(\d+)$/i);
    if (!match) return null;

    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);

    if (width < 1 || height < 1) return null;

    return { width, height };
}

export async function GET(request: NextRequest, context: { params: { id: string; dimensions: string } }) {
    try {
        // Get and await params
        const params = await context.params;

        // Validate dimensions format
        const dimensions = validateDimensions(params.dimensions);
        if (!dimensions) {
            return new NextResponse(
                "Invalid dimensions. They must be in the form AxB where A and B are positive integers.",
                { status: 400 },
            );
        }

        // Get APP_DATA directory
        const appDataDir = process.env.APP_DATA;
        if (!appDataDir) {
            return new NextResponse("APP_DATA directory not configured", { status: 500 });
        }

        // Get file metadata
        const fileMetadata = await filesService.get(params.id);
        if (!fileMetadata) {
            return new NextResponse("File not found", { status: 404 });
        }

        // Ensure it's an image file
        if (!fileMetadata.mimeType.startsWith("image/")) {
            return new NextResponse("File is not an image", { status: 400 });
        }

        const { originalFilePath, resizedPath, exists } = await filesService.getPathsForResizeOperation(
            fileMetadata,
            dimensions.width,
            dimensions.height,
        );

        if (exists) {
            return new NextResponse(await readFile(resizedPath), {
                headers: {
                    "Content-Type": fileMetadata.mimeType,
                    "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
                },
            });
        }

        // If file doesn't exist, create it
        const originalBuffer = await readFile(originalFilePath);

        // Resize image
        const resizedBuffer = await sharp(originalBuffer)
            .resize(dimensions.width, dimensions.height, {
                fit: "cover",
                withoutEnlargement: true,
            })
            .toBuffer();

        // Save resized image
        await writeFile(resizedPath, resizedBuffer);

        // Return the resized image
        return new NextResponse(resizedBuffer, {
            headers: {
                "Content-Type": fileMetadata.mimeType,
                "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
            },
        });
    } catch (error) {
        console.error("Error serving resized file:", error);

        if (error instanceof FileNotFoundError) {
            return new NextResponse("File not found", { status: 404 });
        }

        if (error instanceof InvalidPathError) {
            return new NextResponse("Invalid path", { status: 400 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}
