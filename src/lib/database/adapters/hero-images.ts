import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";
import { HeroImagesAdapterType, HeroImage } from "@/types/database";

export class HeroImagesAdapter implements HeroImagesAdapterType {
    async getAll(tx?: Prisma.TransactionClient): Promise<HeroImage[]> {
        const client = tx || prisma;
        const results = await client.heroImage.findMany({
            include: {
                file: true,
                podcast: true,
                episode: true,
            },
        });
        return results as unknown as HeroImage[];
    }

    async getById(id: number, tx?: Prisma.TransactionClient): Promise<HeroImage | null> {
        const client = tx || prisma;
        const result = await client.heroImage.findUnique({
            where: { id },
            include: {
                file: true,
                podcast: true,
                episode: true,
            },
        });
        return result as unknown as HeroImage | null;
    }

    async create(
        data: Pick<HeroImage, "name" | "description" | "fileId" | "podcastId" | "episodeId" | "urlTo">,
        tx?: Prisma.TransactionClient,
    ): Promise<HeroImage> {
        const client = tx || prisma;
        const result = await client.heroImage.create({
            data: {
                name: data.name,
                description: data.description,
                fileId: data.fileId,
                podcastId: data.podcastId,
                episodeId: data.episodeId,
                urlTo: data.urlTo,
            },
            include: {
                file: true,
                podcast: true,
                episode: true,
            },
        });
        return result as unknown as HeroImage;
    }

    async update(
        id: number,
        data: Partial<Omit<HeroImage, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<HeroImage> {
        const client = tx || prisma;
        const result = await client.heroImage.update({
            where: { id },
            data: data as any,
            include: {
                file: true,
                podcast: true,
                episode: true,
            },
        });
        return result as unknown as HeroImage;
    }

    async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.heroImage.delete({
            where: { id },
        });
    }
}
