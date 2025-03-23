import { PodcastService } from "@/types/services";
import { Podcast, PodcastsAdapterType } from "@/types/database";
import PodcastsAdapter from "@/lib/database/adapters/podcasts";

export class DefaultPodcastService implements PodcastService {
    private adapter: PodcastsAdapterType;

    constructor() {
        this.adapter = new PodcastsAdapter();
    }

    async list(): Promise<Podcast[]> {
        return this.adapter.getAll();
    }

    async get(id: number): Promise<Podcast | null> {
        return this.adapter.getById(id);
    }

    async create(data: Omit<Podcast, "id" | "created_at" | "updated_at">): Promise<Podcast> {
        return this.adapter.create(data);
    }

    async update(
        id: number,
        data: Partial<Omit<Podcast, "id" | "created_at" | "updated_at">>,
    ): Promise<Podcast> {
        return this.adapter.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.adapter.delete(id);
    }

    async publishPodcast(id: number): Promise<Podcast> {
        return this.adapter.update(id, { published: true });
    }

    async unpublishPodcast(id: number): Promise<Podcast> {
        return this.adapter.update(id, { published: false });
    }
}

// Export a singleton instance
export const podcastService = new DefaultPodcastService();
