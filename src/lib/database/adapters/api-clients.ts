import { ApiClientsAdapterType, ApiClient } from "@/types/database";
import { prisma } from "@/lib/database/prisma";
import { Prisma } from "@prisma/client";

class ApiClientsAdapter implements ApiClientsAdapterType {
    async getAll(tx?: Prisma.TransactionClient): Promise<ApiClient[]> {
        const client = tx || prisma;
        const result = await client.apiClient.findMany();
        console.log("API CLIENTS =", result);
        return result;
    }

    async getById(id: number, tx?: Prisma.TransactionClient): Promise<ApiClient | null> {
        const client = tx || prisma;
        return await client.apiClient.findUnique({
            where: { id: id },
        });
    }

    async create(
        data: Omit<ApiClient, "id" | "created_at" | "updated_at">,
        tx?: Prisma.TransactionClient,
    ): Promise<ApiClient> {
        const client = tx || prisma;
        return await client.apiClient.create({
            data: {
                name: data.name,
                description: data.description,
                token: data.token,
                isActive: data.isActive ?? true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async update(
        id: number,
        data: Partial<Omit<ApiClient, "id" | "created_at" | "updated_at">>,
        tx?: Prisma.TransactionClient,
    ): Promise<ApiClient> {
        const client = tx || prisma;
        return await client.apiClient.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                token: data.token,
                isActive: data.isActive,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.apiClient.delete({
            where: { id },
        });
    }
}

export default ApiClientsAdapter;
