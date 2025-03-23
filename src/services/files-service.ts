import { FilesAdapter } from "@/lib/database/adapters/files";
import { MIME_TYPES } from "@/lib/mime-types";
import { FileMetadata, FilesAdapterType } from "@/types/database";
import { FileMetadataService } from "@/types/services";
import { ffprobe } from "fluent-ffmpeg";
import { mkdir, writeFile } from "fs/promises";
import { join, resolve } from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export class FileUploadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileUploadError";
    }
}

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

    async delete(id: string): Promise<void> {
        await this.adapter.delete(id);
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
        const url = `/api/files/${fileId}.${fileExt}`;

        // Create file metadata record
        const fileMetadata = await filesService.create({
            id: fileId,
            name: file.name,
            path: relativePath,
            size: file.size,
            mimeType,
            width,
            height,
            duration,
            url,
        });

        return fileMetadata;
    }
}

export const filesService = new DefaultFileMetadataService();
