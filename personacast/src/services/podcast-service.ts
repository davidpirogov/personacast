import { PodcastService } from "@/types/services";
import { Podcast } from "@/types/database";
import PodcastsAdapter from "@/lib/database/adapters/podcasts";

export class DefaultPodcastService implements PodcastService {
    private adapter: PodcastsAdapter;

    constructor() {
        this.adapter = new PodcastsAdapter();
    }

    async listPodcasts(): Promise<Podcast[]> {
        return this.adapter.getAll();
    }

    async getPodcast(id: string): Promise<Podcast | null> {
        return this.adapter.getById(id);
    }

    async createPodcast(data: Omit<Podcast, "id" | "created_at" | "updated_at">): Promise<Podcast> {
        return this.adapter.create(data);
    }

    async updatePodcast(
        id: string,
        data: Partial<Omit<Podcast, "id" | "created_at" | "updated_at">>,
    ): Promise<Podcast> {
        return this.adapter.update(id, data);
    }

    async publishPodcast(id: string): Promise<Podcast> {
        return this.adapter.update(id, { published: true });
    }

    async unpublishPodcast(id: string): Promise<Podcast> {
        return this.adapter.update(id, { published: false });
    }

    async deletePodcast(id: string): Promise<void> {
        await this.adapter.delete(id);
    }
}

// Export a singleton instance
export const podcastService = new DefaultPodcastService();
