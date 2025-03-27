import { InvalidPathError } from "@/app/api/files/safe-path";
import { FileMetadata } from "@/lib/database/types/models.d";
import FilesAdapter from "@/lib/database/adapters/files";
import { MIME_TYPES } from "@/lib/mime-types";
import { FileMetadataService } from "./files.d";
import { UuidService } from "./base";
import { heroReferenceService } from "./hero-references";
import { ffprobe } from "fluent-ffmpeg";
import { mkdir, unlink, writeFile, readdir, readFile, access, rmdir } from "fs/promises";
import { join, resolve } from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export class FileUploadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileUploadError";
    }
}

export const FILES_DIR = "files";

/**
 * Implementation of FileMetadataService using the base service pattern
 */
class FileMetadataServiceImpl extends UuidService<FileMetadata> implements FileMetadataService {
    private appDataDir: string;

    constructor() {
        super(new FilesAdapter());

        if (!process.env.APP_DATA) {
            throw new Error("APP_DATA directory not configured");
        }

        this.appDataDir = process.env.APP_DATA;
    }

    /**
     * Deletes a file and all its associated resources (thumbnails, metadata) from the system.
     *
     * This method performs a complete cleanup by:
     * 1. Deleting all generated thumbnails associated with the file
     * 2. Removing the original file from disk
     * 3. Deleting the file metadata from the database
     * 4. Cleaning up empty directories if this was the last file
     *
     * The deletion process is resilient - if any step fails, it logs the error and continues
     * with the remaining steps to ensure maximum cleanup is performed.
     *
     * @param id - The unique identifier of the file to delete
     * @throws {Error} If the file metadata is not found in the database
     * @returns {Promise<void>} A promise that resolves when all deletion steps are complete
     *
     * Directory Structure:
     * - Files are stored in subdirectories named by the first 2 characters of their ID
     * - Example: For ID "abc123", the file is stored in "/files/ab/abc123.ext"
     *
     * Error Handling:
     * - Each deletion step (thumbnails, file, metadata, directory) is handled independently
     * - Failures in one step don't prevent attempts of other steps
     * - All errors are logged but don't stop the process
     */
    async delete(id: string): Promise<void> {
        const fileMetadata = await this.get(id);
        if (!fileMetadata) {
            throw new Error("File not found");
        }

        // Check if the file is referenced in site settings or other entities
        await heroReferenceService.handleFileDelete(id);

        const dirPrefix = fileMetadata.id.substring(0, 2);

        // Get all thumbnails for the file
        const thumbnails = await this.getThumbnails(id);

        // Delete all thumbnails from disk
        for (const thumbnail of thumbnails) {
            try {
                await unlink(join(this.appDataDir, thumbnail));
            } catch (error) {
                console.error("Error deleting thumbnail from disk:", error);
            }
        }

        try {
            // Delete the file from disk
            await unlink(join(this.appDataDir, fileMetadata.path));
        } catch (error) {
            console.error("Error deleting file from disk:", error);
        }

        try {
            // Delete the file metadata from the database
            await super.delete(id);
        } catch (error) {
            console.error("Error deleting file metadata from the database:", error);
        }

        try {
            // Check the directory if it is the last file in the directory
            const files = await readdir(join(this.appDataDir, "files", dirPrefix));
            if (files.length === 0) {
                await rmdir(join(this.appDataDir, "files", dirPrefix));
            }
        } catch (error) {
            console.error("Error deleting directory:", error);
        }
    }

    /**
     * Get a file by name
     */
    async getByName(name: string): Promise<FileMetadata | null> {
        const files = await this.list();
        return files.find((file) => file.name === name) || null;
    }

    /**
     * Upload a file and create its metadata
     */
    async upload(file: File): Promise<FileMetadata> {
        // Generate UUID and create directory structure
        const fileId = uuidv4();
        const dirPrefix = fileId.substring(0, 2);
        const fileExt = "." + file.name.split(".").pop()?.toLowerCase();

        // Validate file size
        if (file.size > parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "100000000")) {
            throw new FileUploadError(
                `File size exceeds maximum allowed size of ${process.env.NEXT_PUBLIC_MAX_FILE_SIZE} bytes`,
            );
        }

        // Validate file extension and MIME type
        if (!Object.keys(MIME_TYPES).includes(fileExt)) {
            throw new FileUploadError(`Unsupported file type '${fileExt}'`);
        }

        // Create directory structure
        const uploadDir = join(this.appDataDir, "files", dirPrefix);
        await mkdir(uploadDir, { recursive: true });

        // Construct file path and validate
        const fileName = `${fileId}${fileExt}`;
        const filePath = join(uploadDir, fileName);
        const resolvedPath = resolve(filePath);

        // Ensure resolved path is within APP_DATA directory
        if (!resolvedPath.startsWith(resolve(this.appDataDir))) {
            throw new FileUploadError("Invalid file path");
        }

        // Convert File to Buffer and write to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Initialize metadata
        let width: number | null = null;
        let height: number | null = null;
        let duration: number | null = null;

        // Extract metadata based on file type
        const mimeType = MIME_TYPES[fileExt as keyof typeof MIME_TYPES];
        if (mimeType.startsWith("image/")) {
            // Process image metadata
            const metadata = await sharp(buffer).metadata();
            width = metadata.width || null;
            height = metadata.height || null;
        } else if (mimeType.startsWith("audio/") || mimeType.startsWith("video/")) {
            // Process audio/video metadata
            const probeData = await new Promise<any>((resolve, reject) => {
                ffprobe(filePath, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
            if (probeData && probeData.streams && probeData.streams[0]) {
                duration = Math.round(parseFloat(probeData.streams[0].duration || "0"));

                // For video files, also get dimensions
                if (mimeType.startsWith("video/")) {
                    const videoStream = probeData.streams.find(
                        (stream: { codec_type: string; width?: number; height?: number }) =>
                            stream.codec_type === "video" && stream.width && stream.height,
                    );
                    if (videoStream) {
                        width = videoStream.width || null;
                        height = videoStream.height || null;
                    }
                }
            }
        }

        // Create file metadata in the database
        const relativePath = join(FILES_DIR, dirPrefix, fileName);
        const fileMetadata = await this.create({
            name: file.name,
            path: relativePath,
            size: file.size,
            mimeType: mimeType,
            width,
            height,
            duration,
            url: `/api/files/${fileId}`,
            extension: fileExt,
        });

        return fileMetadata;
    }

    /**
     * Get paths for resize operation
     */
    async getPathsForResizeOperation(
        fileMetadata: FileMetadata,
        width: number,
        height: number,
    ): Promise<{ originalFilePath: string; resizedPath: string; exists: boolean }> {
        const originalFilePath = join(this.appDataDir, fileMetadata.path);

        // Get the directory and base filename
        const dirPrefix = fileMetadata.id.substring(0, 2);
        const baseFilename = fileMetadata.id;

        // Create the resized path
        const resizedFilename = `${baseFilename}-${width}x${height}.webp`;
        const resizedPath = join(this.appDataDir, FILES_DIR, dirPrefix, "thumbs", resizedFilename);

        // Ensure thumbs directory exists
        const thumbsDir = join(this.appDataDir, FILES_DIR, dirPrefix, "thumbs");
        await mkdir(thumbsDir, { recursive: true });

        // Check if the resized image already exists
        let exists = false;
        try {
            await access(resizedPath);
            exists = true;
        } catch (error) {
            exists = false;
        }

        return { originalFilePath, resizedPath, exists };
    }

    /**
     * Resize an image and return the URL
     */
    async resizeImage(fileMetadata: FileMetadata, width: number, height: number): Promise<string> {
        const { originalFilePath, resizedPath, exists } = await this.getPathsForResizeOperation(
            fileMetadata,
            width,
            height,
        );

        if (!exists) {
            await this.resizeImageOnDisk(originalFilePath, resizedPath, width, height);
        }

        // Return the URL for the resized image
        const dirPrefix = fileMetadata.id.substring(0, 2);
        return `/api/files/thumbs/${dirPrefix}/${fileMetadata.id}-${width}x${height}.webp`;
    }

    /**
     * Resize an image on disk
     */
    async resizeImageOnDisk(
        sourcePath: string,
        destinationPath: string,
        width: number,
        height: number,
    ): Promise<string> {
        if (!sourcePath || !destinationPath) {
            throw new Error("Invalid source or destination path");
        }

        if (!sourcePath.startsWith(resolve(this.appDataDir))) {
            throw new InvalidPathError("Invalid source path");
        }

        if (!destinationPath.startsWith(resolve(this.appDataDir))) {
            throw new InvalidPathError("Invalid destination path");
        }

        // Read the source file
        const buffer = await readFile(sourcePath);

        // Resize the image with Sharp
        const resizedBuffer = await sharp(buffer)
            .resize({
                width,
                height,
                fit: "inside",
                withoutEnlargement: true,
            })
            .webp({ quality: 85 })
            .toBuffer();

        // Write the resized image to disk
        await writeFile(destinationPath, resizedBuffer);

        return destinationPath;
    }

    /**
     * Get thumbnails for a file
     */
    async getThumbnails(id: string): Promise<string[]> {
        const fileMetadata = await this.get(id);
        if (!fileMetadata) {
            return [];
        }

        const dirPrefix = fileMetadata.id.substring(0, 2);
        const thumbsDir = join(this.appDataDir, "files", dirPrefix);

        try {
            // Check if thumbs directory exists
            await access(thumbsDir);

            // List all files in the thumbs directory
            const files = await readdir(thumbsDir);

            // Filter for thumbnails matching this file's ID
            const thumbnails = files
                .filter((file) => file.startsWith(fileMetadata.id))
                .map((file) => join(FILES_DIR, dirPrefix, file));

            return thumbnails;
        } catch (error) {
            // Directory doesn't exist or can't be accessed
            return [];
        }
    }
}

// Export a singleton instance
export const filesService = new FileMetadataServiceImpl();

// Export the interface for better type inference
export type { FileMetadataService };
