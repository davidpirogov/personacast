import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";
import { Variable, VariablesAdapterType } from "@/types/database";

export class VariablesAdapter implements VariablesAdapterType {
    async getAll(tx?: Prisma.TransactionClient): Promise<Variable[]> {
        const client = tx || prisma;
        return await client.variable.findMany();
    }

    async getById(id: number, tx?: Prisma.TransactionClient): Promise<Variable | null> {
        const client = tx || prisma;
        return await client.variable.findUnique({
            where: { id },
        });
    }

    async getByName(name: string, tx?: Prisma.TransactionClient): Promise<Variable | null> {
        const client = tx || prisma;
        return await client.variable.findUnique({
            where: { name },
        });
    }

    async create(
        data: Omit<Variable, "id" | "createdAt" | "updatedAt">,
        tx?: Prisma.TransactionClient,
    ): Promise<Variable> {
        const client = tx || prisma;
        return await client.variable.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async update(
        id: number,
        data: Partial<Omit<Variable, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<Variable> {
        const client = tx || prisma;
        return await client.variable.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.variable.delete({
            where: { id },
        });
    }
}
