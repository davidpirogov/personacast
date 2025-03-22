import { Podcast } from "./database";

export interface PodcastService {
  /**
   * List all podcasts
   */
  listPodcasts(): Promise<Podcast[]>;

  /**
   * Get a podcast by ID
   */
  getPodcast(id: string): Promise<Podcast | null>;

  /**
   * Create a new podcast
   */
  createPodcast(data: Omit<Podcast, "id" | "created_at" | "updated_at">): Promise<Podcast>;

  /**
   * Update an existing podcast
   */
  updatePodcast(id: string, data: Partial<Omit<Podcast, "id" | "created_at" | "updated_at">>): Promise<Podcast>;

  /**
   * Publish a podcast
   */
  publishPodcast(id: string): Promise<Podcast>;

  /**
   * Unpublish a podcast
   */
  unpublishPodcast(id: string): Promise<Podcast>;

  /**
   * Delete a podcast
   */
  deletePodcast(id: string): Promise<void>;
}
