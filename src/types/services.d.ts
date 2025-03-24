import { Podcast } from "./database";

export interface CRUDService<
    T,
    CreateDTO = Omit<T, "id" | "created_at" | "updated_at">,
    UpdateDTO = Partial<CreateDTO>,
> {
    /**
     * List all resources
     */
    list(): Promise<T[]>;

    /**
     * Get a resource by ID
     */
    get(id: number): Promise<T | null>;

    /**
     * Create a new resource
     */
    create(data: CreateDTO): Promise<T>;

    /**
     * Update an existing resource
     */
    update(id: number, data: UpdateDTO): Promise<T>;

    /**
     * Delete a resource
     */
    delete(id: number): Promise<void>;
}

export interface PodcastService extends CRUDService<Podcast> {
    /**
     * Publish a podcast
     */
    publishPodcast(id: number): Promise<Podcast>;

    /**
     * Unpublish a podcast
     */
    unpublishPodcast(id: number): Promise<Podcast>;
}

export interface ApiClientService extends CRUDService<ApiClient> {
    /**
     * Generate a new token for an API client
     */
    generateToken(id: number): Promise<string>;
}

export interface VariablesService extends CRUDService<Variable> {
    /**
     * Get a variable by name
     */
    getByName(name: string): Promise<Variable | null>;
}

export interface FileMetadataService extends CRUDService<FileMetadata> {
    /**
     * Get a file by ID
     */
    get(id: string): Promise<FileMetadata | null>;

    /**
     * Upload a file
     */
    upload(file: File): Promise<FileMetadata>;

    /**
     * Update an existing file
     */
    update(id: string, data: UpdateDTO): Promise<FileMetadata>;

    /**
     * Delete a file
     */
    delete(id: string): Promise<void>;

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
