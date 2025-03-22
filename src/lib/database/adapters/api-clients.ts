import { DatabaseAdapter, ApiClient } from "@/types/database";
import { prisma } from "@/lib/database/prisma";

class ApiClientsAdapter implements DatabaseAdapter<ApiClient> {
    async getAll(): Promise<ApiClient[]> {
        const result = await prisma.apiClient.findMany();
        console.log("API CLIENTS =", result);
        return result;
    }

    async getById(id: string): Promise<ApiClient | null> {
        return await prisma.apiClient.findUnique({
            where: { id: parseInt(id) },
        });
    }

    async create(data: Omit<ApiClient, "id" | "created_at" | "updated_at">): Promise<ApiClient> {
        return await prisma.apiClient.create({
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
        id: string,
        data: Partial<Omit<ApiClient, "id" | "created_at" | "updated_at">>,
    ): Promise<ApiClient> {
        return await prisma.apiClient.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                description: data.description,
                token: data.token,
                isActive: data.isActive,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.apiClient.delete({
            where: { id: parseInt(id) },
        });
    }
}

export default ApiClientsAdapter;
