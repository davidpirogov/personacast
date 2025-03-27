import { Prisma, Variable } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { HeroImagesAdapterType } from "@/lib/database/types/adapters.d";
import { HeroImage } from "@/lib/database/types/models.d";
import { IdAdapter } from "@/lib/database/base/id-adapter";

/**
 * Adapter for managing HeroImage entities
 * Using base adapter pattern with overrides for specialized methods
 */
class HeroImagesAdapter extends IdAdapter<HeroImage> implements HeroImagesAdapterType {
    constructor() {
        super("heroImage");
    }

    async getAll(tx?: Prisma.TransactionClient): Promise<HeroImage[]> {
        const client = tx || db;
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
        const client = tx || db;
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
        const client = tx || db;
        const result = await client.heroImage.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
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
        const client = tx || db;
        const result = await client.heroImage.update({
            where: { id },
            data: {
                ...(data as any),
                updatedAt: new Date(),
            },
            include: {
                file: true,
                podcast: true,
                episode: true,
            },
        });
        return result as unknown as HeroImage;
    }

    // async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    //     const client = tx || db;
    //     await client.heroImage.delete({
    //         where: { id },
    //     });
    // }
}

export default HeroImagesAdapter;