import { Episode, EpisodesAdapterType } from "@/types/database";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";

class EpisodesAdapter implements EpisodesAdapterType {
    async getAll(tx?: Prisma.TransactionClient): Promise<Episode[]> {
        const client = tx || prisma;
        return await client.episode.findMany();
    }

    async getById(id: number, tx?: Prisma.TransactionClient): Promise<Episode | null> {
        const client = tx || prisma;
        return await client.episode.findUnique({
            where: { id },
        });
    }

    async create(
        data: Omit<Episode, "id" | "createdAt" | "updatedAt">,
        tx?: Prisma.TransactionClient,
    ): Promise<Episode> {
        const client = tx || prisma;
        return await client.episode.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async update(
        id: number,
        data: Partial<Omit<Episode, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<Episode> {
        const client = tx || prisma;
        return await client.episode.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.episode.delete({
            where: { id },
        });
    }

    async getByPodcastId(podcastId: number, tx?: Prisma.TransactionClient): Promise<Episode[]> {
        const client = tx || prisma;
        return await client.episode.findMany({
            where: { podcastId },
        });
    }

    async getBySlug(slug: string, tx?: Prisma.TransactionClient): Promise<Episode | null> {
        const client = tx || prisma;
        return await client.episode.findUnique({
            where: { slug },
        });
    }

    async getByPodcastIdAndEpisodeSlug(
        podcastId: number,
        episodeSlug: string,
        tx?: Prisma.TransactionClient,
    ): Promise<Episode | null> {
        const client = tx || prisma;
        return await client.episode.findUnique({
            where: { podcastId, slug: episodeSlug },
        });
    }
}

export default EpisodesAdapter;
