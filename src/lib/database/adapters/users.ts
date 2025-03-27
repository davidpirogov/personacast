import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { UuidAdapter } from "@/lib/database/base/uuid-adapter";
import { User } from "@/lib/database/types/models.d";
import { UsersAdapterType } from "@/lib/database/types/adapters.d";

/**
 * Adapter for managing User entities
 * Using base adapter pattern with overrides for account relationships
 */
class UsersAdapter extends UuidAdapter<User> implements UsersAdapterType {
    constructor() {
        super("user");
    }

    /**
     * Override getAll to include accounts relationship
     */
    async getAll(tx?: Prisma.TransactionClient): Promise<User[]> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        const users = await modelClient.findMany({
            include: {
                accounts: true,
            },
        });
        return users as User[];
    }

    /**
     * Override getById to include accounts relationship
     */
    async getById(id: string, tx?: Prisma.TransactionClient): Promise<User | null> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        const user = await modelClient.findUnique({
            where: { id },
            include: {
                accounts: true,
            },
        });
        return user as User | null;
    }

    /**
     * Override create to handle accounts relationship
     */
    async create(
        data: Omit<User, "id" | "createdAt" | "updatedAt">,
        tx?: Prisma.TransactionClient,
    ): Promise<User> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        // Extract accounts to handle separately but keep accounts in type
        const { accounts, ...userData } = data;
        // We can't use the base prepareCreateData as we need to handle accounts specially
        const user = await modelClient.create({
            data: {
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date(),
                accounts: {
                    create: accounts,
                },
            },
            include: {
                accounts: true,
            },
        }) as User;
        return user;
    }

    /**
     * Override update to handle accounts relationship
     */
    async update(
        id: string,
        data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<User> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        // Extract accounts to handle separately
        const { accounts, ...userData } = data;
        // We can't use prepareUpdateData here due to accounts handling
        const user = await modelClient.update({
            where: { id },
            data: {
                ...userData,
                updatedAt: new Date(),
                ...(accounts && {
                    accounts: {
                        deleteMany: {},
                        create: accounts,
                    },
                }),
            },
            include: {
                accounts: true,
            },
        }) as User;
        return user;
    }

    // async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    //     const client = tx || db;
    //     await client.user.delete({
    //         where: { id },
    //     });
    // }
}

export default UsersAdapter;
