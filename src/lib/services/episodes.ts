import { Episode } from "@/lib/database/types/models.d";
import EpisodesAdapter from "@/lib/database/adapters/episodes";
import { EpisodeService } from "@/lib/services/episodes.d";
import { podcastService } from "@/lib/services/podcasts";
import { IdService } from "@/lib/services/base/id-service";

/**
 * Implementation of EpisodeService using the base service pattern
 */
class EpisodeServiceImpl extends IdService<Episode> implements EpisodeService {
    constructor() {
        super(new EpisodesAdapter());
    }

    /**
     * Publish an episode
     */
    async publishEpisode(id: number): Promise<Episode> {
        return this.update(id, { published: true });
    }

    /**
     * Get episodes by podcast ID
     */
    async getEpisodesByPodcastId(podcastId: number): Promise<Episode[]> {
        return (this.adapter as any).getByPodcastId(podcastId);
    }

    /**
     * Get an episode by slug
     */
    async getEpisodeBySlug(slug: string): Promise<Episode | null> {
        return (this.adapter as any).getBySlug(slug);
    }

    /**
     * Get an episode by podcast slug and episode slug
     */
    async getEpisodeByPodcastSlugAndEpisodeSlug(
        podcastSlug: string,
        episodeSlug: string,
    ): Promise<Episode | null> {
        const podcast = await podcastService.getPodcastBySlug(podcastSlug);

        if (!podcast) {
            return null;
        }

        return (this.adapter as any).getByPodcastIdAndEpisodeSlug(podcast.id, episodeSlug);
    }
}

// Export a singleton instance
export const episodeService = new EpisodeServiceImpl();

// Export the interface for better type inference
export type { EpisodeService };
