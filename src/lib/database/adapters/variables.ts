import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { IdAdapter } from "@/lib/database/base/id-adapter";
import { VariablesAdapterType } from "@/lib/database/types/adapters.d";
import { Variable } from "@/lib/database/types/models.d";

/**
 * Adapter for managing Variable entities
 * Using base adapter pattern for common CRUD operations
 */
class VariablesAdapter extends IdAdapter<Variable> implements VariablesAdapterType {
    constructor() {
        super("variable");
    }

    /**
     * Find a variable by its unique name
     * @param name - Variable name
     * @param tx - Optional transaction client
     * @returns Promise resolving to the variable if found, null otherwise
     */
    async getByName(name: string, tx?: Prisma.TransactionClient): Promise<Variable | null> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return (await modelClient.findUnique({
            where: { name },
        })) as Variable | null;
    }

    // async getAll(tx?: Prisma.TransactionClient): Promise<Variable[]> {
    //     const client = tx || db;
    //     return await client.variable.findMany();
    // }

    // async getById(id: number, tx?: Prisma.TransactionClient): Promise<Variable | null> {
    //     const client = tx || db;
    //     return await client.variable.findUnique({
    //         where: { id },
    //     });
    // }

    // async create(
    //     data: Omit<Variable, "id" | "createdAt" | "updatedAt">,
    //     tx?: Prisma.TransactionClient,
    // ): Promise<Variable> {
    //     const client = tx || db;
    //     return await client.variable.create({
    //         data: {
    //             ...data,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         },
    //     });
    // }

    // async update(
    //     id: number,
    //     data: Partial<Omit<Variable, "id" | "createdAt" | "updatedAt">>,
    //     tx?: Prisma.TransactionClient,
    // ): Promise<Variable> {
    //     const client = tx || db;
    //     return await client.variable.update({
    //         where: { id },
    //         data: {
    //             ...data,
    //             updatedAt: new Date(),
    //         },
    //     });
    // }

    // async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    //     const client = tx || db;
    //     await client.variable.delete({
    //         where: { id },
    //     });
    // }
}

export default VariablesAdapter;
