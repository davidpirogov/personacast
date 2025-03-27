import { Podcast } from "@/lib/database/types/models.d";
import { IdCRUDService } from "@/lib/services/base/services.d";

export interface PodcastService extends IdCRUDService<Podcast> {
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
