import { EpisodeService } from "@/types/services";
import { Episode, EpisodesAdapterType } from "@/types/database";
import EpisodesAdapter from "@/lib/database/adapters/episodes";
import { podcastService } from "./podcast-service";

export class DefaultEpisodeService implements EpisodeService {
    private adapter: EpisodesAdapterType;

    constructor() {
        this.adapter = new EpisodesAdapter();
    }

    async list(): Promise<Episode[]> {
        return this.adapter.getAll();
    }

    async get(id: number): Promise<Episode | null> {
        return this.adapter.getById(id);
    }

    async create(data: Omit<Episode, "id" | "createdAt" | "updatedAt">): Promise<Episode> {
        return this.adapter.create(data);
    }

    async update(
        id: number,
        data: Partial<Omit<Episode, "id" | "createdAt" | "updatedAt">>,
    ): Promise<Episode> {
        return this.adapter.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.adapter.delete(id);
    }

    async publishEpisode(id: number): Promise<Episode> {
        return this.adapter.update(id, { published: true });
    }

    async unpublishEpisode(id: number): Promise<Episode> {
        return this.adapter.update(id, { published: false });
    }

    async getEpisodesByPodcastId(podcastId: number): Promise<Episode[]> {
        return this.adapter.getByPodcastId(podcastId);
    }

    async getEpisodeBySlug(slug: string): Promise<Episode | null> {
        return this.adapter.getBySlug(slug);
    }

    async getEpisodeByPodcastSlugAndEpisodeSlug(
        podcastSlug: string,
        episodeSlug: string,
    ): Promise<Episode | null> {
        const podcast = await podcastService.getPodcastBySlug(podcastSlug);

        if (!podcast) {
            return null;
        }

        return this.adapter.getByPodcastIdAndEpisodeSlug(podcast.id, episodeSlug);
    }
}

// Export a singleton instance
export const episodeService = new DefaultEpisodeService();
