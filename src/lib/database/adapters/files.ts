import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { UuidAdapter } from "@/lib/database/base/uuid-adapter";
import { FilesAdapterType } from "@/lib/database/types/adapters.d";
import { FileMetadata } from "@/lib/database/types/models.d";

/**
 * Adapter for managing FileMetadata entities
 * Using base adapter pattern for common CRUD operations
 */
class FilesAdapter extends UuidAdapter<FileMetadata> implements FilesAdapterType {
    constructor() {
        super("fileMetadata");
    }

    // async getAll(tx?: Prisma.TransactionClient): Promise<FileMetadata[]> {
    //     const client = tx || db;
    //     return await client.fileMetadata.findMany();
    // }

    // async getById(id: string, tx?: Prisma.TransactionClient): Promise<FileMetadata | null> {
    //     const client = tx || db;
    //     return await client.fileMetadata.findUnique({
    //         where: { id },
    //     });
    // }

    // async create(
    //     data: Omit<FileMetadata, "id" | "createdAt" | "updatedAt">,
    //     tx?: Prisma.TransactionClient,
    // ): Promise<FileMetadata> {
    //     const client = tx || db;
    //     return await client.fileMetadata.create({
    //         data: {
    //             ...data,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         },
    //     });
    // }

    // async update(
    //     id: string,
    //     data: Partial<Omit<FileMetadata, "id" | "createdAt" | "updatedAt">>,
    //     tx?: Prisma.TransactionClient,
    // ): Promise<FileMetadata> {
    //     const client = tx || db;
    //     return await client.fileMetadata.update({
    //         where: { id },
    //         data: {
    //             ...data,
    //             updatedAt: new Date(),
    //         },
    //     });
    // }

    // async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    //     const client = tx || db;
    //     await client.fileMetadata.delete({
    //         where: { id },
    //     });
    // }
}

export default FilesAdapter;
