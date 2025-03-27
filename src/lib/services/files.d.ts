import { FileMetadata } from "@/lib/database/types/models.d";
import { UuidCRUDService } from "@/lib/services/base/services.d";

export interface FileMetadataService extends UuidCRUDService<FileMetadata> {
    /**
     * Upload a file
     */
    upload(file: File): Promise<FileMetadata>;

    /**
     * Get a file by name
     */
    getByName(name: string): Promise<FileMetadata | null>;

    /**
     * Resize an image
     */
    resizeImage(fileMetadata: FileMetadata, width: number, height: number): Promise<string>;

    /**
     * Resize an image on disk
     */
    resizeImageOnDisk(
        sourcePath: string,
        destinationPath: string,
        width: number,
        height: number,
    ): Promise<string>;

    /**
     * Get the paths for a resize operation
     */
    getPathsForResizeOperation(
        fileMetadata: FileMetadata,
        width: number,
        height: number,
    ): Promise<{ originalFilePath: string; resizedPath: string }>;

    /**
     * Get thumbnails for a file, which are returned as an array of paths
     */
    getThumbnails(id: string): Promise<string[]>;
}
