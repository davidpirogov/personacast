import { Podcast } from "@/lib/database/types/models.d";
import PodcastsAdapter from "@/lib/database/adapters/podcasts";
import { PodcastService } from "./podcasts.d";
import { IdService } from "./base";

/**
 * Implementation of PodcastService using the base service pattern
 */
class PodcastServiceImpl extends IdService<Podcast> implements PodcastService {
    constructor() {
        super(new PodcastsAdapter());
    }

    /**
     * Publish a podcast
     */
    async publishPodcast(id: number): Promise<Podcast> {
        return this.update(id, { published: true });
    }

    /**
     * Unpublish a podcast
     */
    async unpublishPodcast(id: number): Promise<Podcast> {
        return this.update(id, { published: false });
    }

    /**
     * Get a podcast by slug
     */
    async getPodcastBySlug(slug: string): Promise<Podcast | null> {
        // Use the adapter's specialized method
        return (this.adapter as any).getBySlug(slug);
    }
}

// Export a singleton instance
export const podcastService = new PodcastServiceImpl();

// Export the interface for better type inference
export type { PodcastService };
