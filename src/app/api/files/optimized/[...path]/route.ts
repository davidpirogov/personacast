import { NextRequest, NextResponse } from "next/server";
import { isValidUUID } from "@/lib/utils";
import { InvalidPathError, FileNotFoundError, validateOptimizedImagePath } from "@/app/api/files/safe-path";
import { getOptimizedHeroImagePath, serveOptimizedImage } from "../utils";

/**
 * Handles GET requests for optimized images with a catch-all route
 * URL pattern: /api/files/optimized/[...path]
 * Expected formats:
 * - /api/files/optimized/{fileId}/hero/{size}.{ext}
 * - /api/files/optimized/{fileId}/hero/placeholder.webp
 */
export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
    try {
        const params = await context.params;
        const pathSegments = params.path;

        // Validate and parse the path using our specialized validator
        const { fileId, type, size, extension } = validateOptimizedImagePath(pathSegments);

        // Additional UUID validation for security
        if (!isValidUUID(fileId)) {
            return new NextResponse("Invalid file identifier", { status: 400 });
        }

        // Handle different optimization types
        if (type === "hero") {
            // Get file path for the optimized hero image
            const pathInfo = await getOptimizedHeroImagePath(fileId, size, extension);

            if (!pathInfo) {
                return new NextResponse("Hero image not found", { status: 404 });
            }

            // Serve the optimized image
            try {
                return await serveOptimizedImage(pathInfo.filePath, pathInfo.contentType);
            } catch (error) {
                if (error instanceof FileNotFoundError) {
                    return new NextResponse("Optimized image not found", { status: 404 });
                }
                throw error; // Re-throw other errors
            }
        }

        // Handle additional types in the future
        return new NextResponse("Unsupported optimization type", { status: 400 });
    } catch (error) {
        console.error("Error serving optimized image:", error);

        if (error instanceof InvalidPathError) {
            return new NextResponse("Invalid path", { status: 400 });
        }

        if (error instanceof FileNotFoundError) {
            return new NextResponse("File not found", { status: 404 });
        }

        return new NextResponse("Internal server error", { status: 500 });
    }
}
