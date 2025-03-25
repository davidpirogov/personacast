import { Podcast, Episode, ApiClient, Variable, FileMetadata, HeroImage, MenuItem } from "./database";

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

    /**
     * Get a podcast by slug
     */
    getPodcastBySlug(slug: string): Promise<Podcast | null>;
}

export interface EpisodeService extends CRUDService<Episode> {
    /**
     * Publish an episode
     */
    publishEpisode(id: number): Promise<Episode>;

    getEpisodesByPodcastId(podcastId: number): Promise<Episode[]>;

    getEpisodeBySlug(slug: string): Promise<Episode | null>;

    getEpisodeByPodcastSlugAndEpisodeSlug(podcastSlug: string, episodeSlug: string): Promise<Episode | null>;
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

export interface HeroImageService extends CRUDService<HeroImage> {
    /**
     * Get a hero image by ID
     */
    getByFileId(fileId: string): Promise<HeroImage | null>;
    getByPodcastId(podcastId: number): Promise<HeroImage | null>;
    getByEpisodeId(episodeId: number): Promise<HeroImage | null>;
}

export interface MenuItemsService extends CRUDService<MenuItem> {
    /**
     * Get a menu item by ID with its children
     */
    getWithChildren(id: number): Promise<MenuItem | null>;

    /**
     * Get all top-level menu items (those without a parent)
     */
    getTopLevelItems(): Promise<MenuItem[]>;

    /**
     * Get all menu items organized in a hierarchical structure
     */
    getMenuTree(): Promise<MenuItem[]>;

    /**
     * Reorder menu items
     */
    reorderItems(items: { id: number; order: number }[]): Promise<void>;

    /**
     * Get a menu item by ID
     */
    get(id: number): Promise<MenuItem | null>;

    /**
     * Create a new menu item
     */
    create(data: Omit<MenuItem, "id" | "createdAt" | "updatedAt">): Promise<MenuItem>;

    /**
     * Update an existing menu item
     */
    update(id: number, data: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>): Promise<MenuItem>;

    /**
     * Delete a menu item
     */
    delete(id: number): Promise<void>;
}
