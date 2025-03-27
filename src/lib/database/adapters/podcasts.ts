import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { IdAdapter } from "@/lib/database/base/id-adapter";
import { PodcastsAdapterType } from "@/lib/database/types/adapters.d";
import { Podcast } from "@/lib/database/types/models.d";

/**
 * Adapter for managing Podcast entities
 * Using base adapter pattern for common CRUD operations
 */
class PodcastsAdapter extends IdAdapter<Podcast> implements PodcastsAdapterType {
    constructor() {
        super("podcast");
    }

    /**
     * Find a podcast by its slug
     * @param slug - Podcast slug
     * @param tx - Optional transaction client
     * @returns Promise resolving to the podcast if found, null otherwise
     */
    async getBySlug(slug: string, tx?: Prisma.TransactionClient): Promise<Podcast | null> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return await modelClient.findUnique({
            where: { slug },
        }) as Podcast | null;
    }

    // async getAll(tx?: Prisma.TransactionClient): Promise<Podcast[]> {
    //     const client = tx || db;
    //     return await client.podcast.findMany();
    // }

    // async getById(id: number, tx?: Prisma.TransactionClient): Promise<Podcast | null> {
    //     const client = tx || db;
    //     return await client.podcast.findUnique({
    //         where: { id },
    //     });
    // }

    // async create(
    //     data: Omit<Podcast, "id" | "createdAt" | "updatedAt">,
    //     tx?: Prisma.TransactionClient,
    // ): Promise<Podcast> {
    //     const client = tx || db;
    //     return await client.podcast.create({
    //         data: {
    //             ...data,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         },
    //     });
    // }

    // async update(
    //     id: number,
    //     data: Partial<Omit<Podcast, "id" | "createdAt" | "updatedAt">>,
    //     tx?: Prisma.TransactionClient,
    // ): Promise<Podcast> {
    //     const client = tx || db;
    //     return await client.podcast.update({
    //         where: { id },
    //         data: {
    //             ...data,
    //             updatedAt: new Date(),
    //         },
    //     });
    // }

    // async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    //     const client = tx || db;
    //     await client.podcast.delete({
    //         where: { id },
    //     });
    // }
}

export default PodcastsAdapter;
