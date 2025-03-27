import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { IdAdapter } from "@/lib/database/base/id-adapter";
import { Episode } from "@/lib/database/types/models.d";
import { EpisodesAdapterType } from "@/lib/database/types/adapters.d";

/**
 * Adapter for managing Episode entities
 * Using base adapter pattern for common CRUD operations
 */
class EpisodesAdapter extends IdAdapter<Episode> implements EpisodesAdapterType {
    constructor() {
        super("episode");
    }

    /**
     * Find episodes by podcast ID
     * @param podcastId - ID of the podcast
     * @param tx - Optional transaction client
     * @returns Promise resolving to an array of episodes
     */
    async getByPodcastId(podcastId: number, tx?: Prisma.TransactionClient): Promise<Episode[]> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return (await modelClient.findMany({
            where: { podcastId },
        })) as Episode[];
    }

    /**
     * Find an episode by its slug
     * @param slug - Episode slug
     * @param tx - Optional transaction client
     * @returns Promise resolving to the episode if found, null otherwise
     */
    async getBySlug(slug: string, tx?: Prisma.TransactionClient): Promise<Episode | null> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return (await modelClient.findUnique({
            where: { slug },
        })) as Episode | null;
    }

    /**
     * Find an episode by podcast ID and episode slug
     * @param podcastId - ID of the podcast
     * @param episodeSlug - Episode slug
     * @param tx - Optional transaction client
     * @returns Promise resolving to the episode if found, null otherwise
     */
    async getByPodcastIdAndEpisodeSlug(
        podcastId: number,
        episodeSlug: string,
        tx?: Prisma.TransactionClient,
    ): Promise<Episode | null> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return (await modelClient.findUnique({
            where: { podcastId_slug: { podcastId, slug: episodeSlug } },
        })) as Episode | null;
    }
}

export default EpisodesAdapter;
