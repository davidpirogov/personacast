import { Episode } from "@/lib/database/types/models.d";
import { IdCRUDService } from "@/lib/services/base/services.d";

export interface EpisodeService extends IdCRUDService<Episode> {
    /**
     * Publish an episode
     */
    publishEpisode(id: number): Promise<Episode>;

    /**
     * Get episodes by podcast ID
     */
    getEpisodesByPodcastId(podcastId: number): Promise<Episode[]>;

    /**
     * Get an episode by slug
     */
    getEpisodeBySlug(slug: string): Promise<Episode | null>;

    /**
     * Get an episode by podcast slug and episode slug
     */
    getEpisodeByPodcastSlugAndEpisodeSlug(podcastSlug: string, episodeSlug: string): Promise<Episode | null>;
}
