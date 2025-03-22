import { IdDatabaseAdapter, Podcast } from "@/types/database";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";

class PodcastsAdapter implements IdDatabaseAdapter<Podcast> {
    async getAll(tx?: Prisma.TransactionClient): Promise<Podcast[]> {
        const client = tx || prisma;
        return await client.podcast.findMany();
    }

    async getById(id: number, tx?: Prisma.TransactionClient): Promise<Podcast | null> {
        const client = tx || prisma;
        return await client.podcast.findUnique({
            where: { id },
        });
    }

    async create(
        data: Omit<Podcast, "id" | "created_at" | "updated_at">,
        tx?: Prisma.TransactionClient,
    ): Promise<Podcast> {
        const client = tx || prisma;
        return await client.podcast.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async update(
        id: number,
        data: Partial<Omit<Podcast, "id" | "created_at" | "updated_at">>,
        tx?: Prisma.TransactionClient,
    ): Promise<Podcast> {
        const client = tx || prisma;
        return await client.podcast.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.podcast.delete({
            where: { id },
        });
    }
}

export default PodcastsAdapter;
