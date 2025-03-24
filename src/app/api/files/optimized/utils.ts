import { NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";
import { filesService } from "@/services/files-service";
import { heroImagesService } from "@/services/hero-images-service";
import { InvalidPathError, FileNotFoundError } from "@/app/api/files/safe-path";

/**
 * Gets the file path for an optimized hero image based on file metadata and image parameters
 */
export async function getOptimizedHeroImagePath(
    fileId: string, 
    size: string, 
    extension: string
): Promise<{ filePath: string; contentType: string } | null> {
    // Check if the file exists
    const fileMetadata = await filesService.get(fileId);
    if (!fileMetadata) {
        return null;
    }

    // Check if this file is associated with a hero image
    const heroImage = await heroImagesService.getByFileId(fileId);
    if (!heroImage) {
        return null;
    }
    
    // Get the APP_DATA directory
    if (!process.env.APP_DATA) {
        throw new Error("APP_DATA is not set");
    }
    
    const appDataDir = process.env.APP_DATA;
    
    // Construct filename based on parameters
    let filename;
    if (size === "placeholder") {
        filename = `${fileId}-hero-placeholder.${extension}`;
    } else {
        filename = `${fileId}-hero-${size}.${extension}`;
    }
    
    // Determine the directory where hero images are stored
    const heroImagesPath = join(
        appDataDir,
        fileMetadata.path.replace(fileMetadata.id, "").replace(fileMetadata.extension, ""),
    );
    
    // Construct the complete file path
    const filePath = join(heroImagesPath, filename);
    
    // Ensure the path doesn't escape the intended directory
    if (!filePath.startsWith(appDataDir)) {
        throw new InvalidPathError("Invalid file path");
    }
    
    // Determine content type based on extension
    const contentType = extension === 'webp' 
        ? 'image/webp' 
        : 'image/jpeg';
    
    return { filePath, contentType };
}

/**
 * Serves an optimized image file with appropriate headers
 */
export async function serveOptimizedImage(
    filePath: string, 
    contentType: string
): Promise<NextResponse> {
    try {
        // Read the file
        const fileBuffer = await readFile(filePath);
        
        // Return the file with appropriate headers
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error("Error serving optimized image:", error);
        throw new FileNotFoundError("Optimized image not found");
    }
} 