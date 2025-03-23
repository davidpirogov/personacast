import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";
import { FilesAdapterType, FileMetadata } from "@/types/database";

export class FilesAdapter implements FilesAdapterType {
    async getAll(tx?: Prisma.TransactionClient): Promise<FileMetadata[]> {
        const client = tx || prisma;
        return await client.fileMetadata.findMany();
    }

    async getById(id: string, tx?: Prisma.TransactionClient): Promise<FileMetadata | null> {
        const client = tx || prisma;
        return await client.fileMetadata.findUnique({
            where: { id },
        });
    }

    async create(
        data: Omit<FileMetadata, "id" | "createdAt" | "updatedAt">,
        tx?: Prisma.TransactionClient,
    ): Promise<FileMetadata> {
        const client = tx || prisma;
        return await client.fileMetadata.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async update(
        id: string,
        data: Partial<Omit<FileMetadata, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<FileMetadata> {
        const client = tx || prisma;
        return await client.fileMetadata.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.fileMetadata.delete({
            where: { id },
        });
    }
}
