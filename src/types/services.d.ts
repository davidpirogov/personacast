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
