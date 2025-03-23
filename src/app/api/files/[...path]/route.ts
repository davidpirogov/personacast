import { NextRequest, NextResponse } from "next/server";
import { join, resolve } from "path";
import { readFile, lstat } from "fs/promises";
import { existsSync } from "fs";
import { MIME_TYPES } from "@/lib/mime-types";
import { validatePath, InvalidPathError, FileNotFoundError } from "../safe-path";

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
    try {
        // Get and await params
        const params = await context.params;

        // Validate path using our new function
        validatePath(params.path);

        // Get the APP_DATA directory
        const appDataDir = process.env.APP_DATA;
        if (!appDataDir) {
            return new NextResponse("APP_DATA directory not configured", { status: 500 });
        }

        // Normalize paths to handle encoding tricks
        const normalizedPath = params.path.map((segment) => decodeURIComponent(segment).normalize("NFKC"));

        // Construct safe path
        const safePath = normalizedPath
            .map((segment) =>
                segment
                    .replace(/\.\./g, "") // Prevent directory traversal
                    .replace(/[^a-zA-Z0-9\/\-_.]/g, ""),
            )
            .join("/");

        // Construct and validate final path
        const filePath = join(appDataDir, safePath);
        const resolvedPath = resolve(filePath);

        // Ensure resolved path is within APP_DATA directory
        if (!resolvedPath.startsWith(resolve(appDataDir))) {
            console.error("Invalid path outside of APP_DATA directory:", resolvedPath);
            throw new InvalidPathError("Invalid path");
        }

        // Check if file exists
        if (!existsSync(filePath)) {
            console.error("File not found:", filePath);
            throw new FileNotFoundError("File not found");
        }

        // Check for symbolic links
        const stats = await lstat(filePath);
        if (stats.isSymbolicLink()) {
            console.error("Symbolic links are not allowed:", filePath);
            throw new InvalidPathError("Invalid file type");
        }

        // Get file extension and MIME type
        const ext = "." + filePath.split(".").pop()?.toLowerCase();
        const contentType = MIME_TYPES[ext as keyof typeof MIME_TYPES] || "application/octet-stream";

        // Read and serve the file
        const fileBuffer = await readFile(filePath);

        // Set cache control for better performance
        const cacheControl = contentType.startsWith("image/")
            ? "public, max-age=31536000, immutable" // 1 year for images
            : "no-cache";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": cacheControl,
                "Content-Length": fileBuffer.length.toString(),
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
