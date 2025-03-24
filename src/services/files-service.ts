import { InvalidPathError } from "@/app/api/files/safe-path";
import { FilesAdapter } from "@/lib/database/adapters/files";
import { MIME_TYPES } from "@/lib/mime-types";
import { FileMetadata, FilesAdapterType } from "@/types/database";
import { FileMetadataService } from "@/types/services";
import { ffprobe } from "fluent-ffmpeg";
import { mkdir, unlink, writeFile, readdir, readFile, access, rmdir } from "fs/promises";
import { join, resolve } from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { heroImagesService } from "@/services/hero-images-service";

export class FileUploadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileUploadError";
    }
}

export const FILES_DIR = "files";

export class DefaultFileMetadataService implements FileMetadataService {
    private adapter: FilesAdapterType;
    private appDataDir: string;

    constructor() {
        this.adapter = new FilesAdapter();
        if (!process.env.APP_DATA) {
            throw new Error("APP_DATA directory not configured");
        }

        this.appDataDir = process.env.APP_DATA;
    }

    async list(): Promise<FileMetadata[]> {
        return this.adapter.getAll();
    }

    async get(id: string): Promise<FileMetadata | null> {
        return this.adapter.getById(id);
    }

    async create(data: Omit<FileMetadata, "createdAt" | "updatedAt">): Promise<FileMetadata> {
        return this.adapter.create(data);
    }

    async update(
        id: string,
        data: Partial<Omit<FileMetadata, "id" | "createdAt" | "updatedAt">>,
    ): Promise<FileMetadata> {
        return this.adapter.update(id, data);
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
            await this.adapter.delete(id);
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

    async getByName(name: string): Promise<FileMetadata | null> {
        const files = await this.list();
        return files.find((file) => file.name === name) || null;
    }

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
                            stream.codec_type === "video",
                    );
                    if (videoStream) {
                        width = videoStream.width || null;
                        height = videoStream.height || null;
                    }
                }
            }
        }

        // Construct relative path and URL
        const relativePath = `files/${dirPrefix}/${fileName}`;
        const url = `/api/files/${fileId}`;

        // Create file metadata record
        const fileMetadata = await filesService.create({
            id: fileId,
            name: file.name,
            path: relativePath,
            size: file.size,
            mimeType,
            extension: fileExt,
            width,
            height,
            duration,
            url,
        });

        return fileMetadata;
    }

    async getPathsForResizeOperation(
        fileMetadata: FileMetadata,
        width: number,
        height: number,
    ): Promise<{ originalFilePath: string; resizedPath: string; exists: boolean }> {
        const originalFilePath = join(this.appDataDir, fileMetadata.path);
        const dirPrefix = fileMetadata.id.substring(0, 2);
        const resizedFileName = `${fileMetadata.id}-${width}x${height}${fileMetadata.extension}`;
        const resizedDir = join(this.appDataDir, "files", dirPrefix);
        const resizedPath = join(resizedDir, resizedFileName);

        // Ensure paths are within APP_DATA directory
        const resolvedResizedPath = resolve(resizedPath);
        if (!resolvedResizedPath.startsWith(resolve(this.appDataDir))) {
            throw new InvalidPathError("Invalid path");
        }

        // Check if the resizedPath already exists
        let resizedPathExists = false;
        try {
            await access(resizedPath);
            resizedPathExists = true;
        } catch (error) {
            // File doesn't exist, which is what we want
            if ((error as NodeJS.ErrnoException).code === "ENOENT") {
                resizedPathExists = false;
            } else {
                // Re-throw any other errors
                throw error;
            }
        }

        return {
            originalFilePath,
            resizedPath,
            exists: resizedPathExists,
        };
    }

    async resizeImage(fileMetadata: FileMetadata, width: number, height: number): Promise<string> {
        if (!fileMetadata.mimeType.startsWith("image/")) {
            throw new Error("File is not an image");
        }

        const { originalFilePath, resizedPath } = await this.getPathsForResizeOperation(
            fileMetadata,
            width,
            height,
        );

        return this.resizeImageOnDisk(originalFilePath, resizedPath, width, height);
    }

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

        await sharp(sourcePath).resize(width, height).toFile(destinationPath);

        return destinationPath;
    }

    async getThumbnails(id: string): Promise<string[]> {
        const fileMetadata = await this.get(id);
        if (!fileMetadata) {
            throw new Error("File not found");
        }

        // Get the directory where the file and its thumbnails are stored
        const dirPrefix = id.substring(0, 2);
        const dir = join(this.appDataDir, "files", dirPrefix);

        try {
            // Read all files in the directory
            const files = await readdir(dir);

            // Filter for files that start with the file ID and are not the original file
            const thumbnails = files
                .filter((file) => file.startsWith(id + "-"))
                .map((file) => join("files", dirPrefix, file));

            return thumbnails;
        } catch (error) {
            console.error("Error getting thumbnails:", error);
            return [];
        }
    }
}

export const filesService = new DefaultFileMetadataService();
