import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

// Define image sizes for different viewports
const IMAGE_SIZES = {
    sm: 640,
    md: 1080,
    lg: 1920,
    xl: 2560,
    "2xl": 3840,
} as const;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        
        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Get the APP_DATA directory from environment variables
        const appDataDir = process.env.APP_DATA;
        if (!appDataDir) {
            return NextResponse.json(
                { error: "APP_DATA directory not configured" },
                { status: 500 }
            );
        }

        // Create the uploads directory if it doesn't exist
        const uploadsDir = join(appDataDir, "uploads", "hero");
        await mkdir(uploadsDir, { recursive: true });

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Initialize Sharp with the buffer
        const image = sharp(buffer);

        // Get image metadata
        const metadata = await image.metadata();
        const originalWidth = metadata.width || 3840;

        // Generate optimized versions
        const optimizedImages = await Promise.all(
            Object.entries(IMAGE_SIZES).map(async ([size, width]) => {
                // Only resize if original is larger than target
                const shouldResize = originalWidth > width;
                const pipeline = shouldResize
                    ? image.clone().resize(width, undefined, {
                          fit: "cover",
                          withoutEnlargement: true,
                      })
                    : image.clone();

                // Generate WebP
                const webpBuffer = await pipeline
                    .webp({ quality: 85, effort: 6 })
                    .toBuffer();

                // Generate JPEG fallback
                const jpegBuffer = await pipeline
                    .jpeg({ quality: 85, progressive: true })
                    .toBuffer();

                // Save both versions
                const baseFilename = `hero-${size}`;
                const webpPath = join(uploadsDir, `${baseFilename}.webp`);
                const jpegPath = join(uploadsDir, `${baseFilename}.jpg`);

                await Promise.all([
                    writeFile(webpPath, webpBuffer),
                    writeFile(jpegPath, jpegBuffer),
                ]);

                // Return paths relative to APP_DATA for the API response
                const relativePath = (fullPath: string) => 
                    fullPath.replace(appDataDir, "").replace(/\\/g, "/").replace(/^\//, "");

                return {
                    size,
                    width,
                    paths: {
                        webp: `/api/files/${relativePath(webpPath)}`,
                        jpeg: `/api/files/${relativePath(jpegPath)}`,
                    },
                };
            }),
        );

        // Generate a low-quality placeholder
        const placeholderBuffer = await image
            .resize(20, undefined, { fit: "cover" })
            .blur(5)
            .webp({ quality: 20 })
            .toBuffer();
        const placeholderBase64 = `data:image/webp;base64,${placeholderBuffer.toString("base64")}`;

        return NextResponse.json({
            success: true,
            images: optimizedImages,
            placeholder: placeholderBase64,
        });
    } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json(
            { error: "Error processing image" },
            { status: 500 }
        );
    }
}
