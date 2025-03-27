import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { IdAdapter } from "@/lib/database/base/id-adapter";
import { ApiClientsAdapterType } from "@/lib/database/types/adapters.d";
import { ApiClient } from "@/lib/database/types/models.d";

class ApiClientsAdapter extends IdAdapter<ApiClient> implements ApiClientsAdapterType {
    constructor() {
        super("apiClient");
    }

    async getAll(tx?: Prisma.TransactionClient): Promise<ApiClient[]> {
        const client = tx || db;
        const result = await client.apiClient.findMany();
        return result;
    }

    async getById(id: number, tx?: Prisma.TransactionClient): Promise<ApiClient | null> {
        const client = tx || db;
        return await client.apiClient.findUnique({
            where: { id: id },
        });
    }

    // async create(
    //     data: Omit<ApiClient, "id" | "created_at" | "updated_at">,
    //     tx?: Prisma.TransactionClient,
    // ): Promise<ApiClient> {
    //     const client = tx || db;
    //     return await client.apiClient.create({
    //         data: {
    //             name: data.name,
    //             description: data.description,
    //             token: data.token,
    //             isActive: data.isActive ?? true,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         },
    //     });
    // }

    // async update(
    //     id: number,
    //     data: Partial<Omit<ApiClient, "id" | "created_at" | "updated_at">>,
    //     tx?: Prisma.TransactionClient,
    // ): Promise<ApiClient> {
    //     const client = tx || db;
    //     return await client.apiClient.update({
    //         where: { id },
    //         data: {
    //             name: data.name,
    //             description: data.description,
    //             token: data.token,
    //             isActive: data.isActive,
    //             updatedAt: new Date(),
    //         },
    //     });
    // }
    // async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    //     const client = tx || db;
    //     await client.apiClient.delete({
    //         where: { id },
    //     });
    // }
}

export default ApiClientsAdapter;
