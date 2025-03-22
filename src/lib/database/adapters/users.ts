import { PrismaClient, Prisma } from "@prisma/client";
import { User, UsersAdapterType } from "@/types/database";

const prisma = new PrismaClient();

export class UsersAdapter implements UsersAdapterType {
    async getAll(tx?: Prisma.TransactionClient): Promise<User[]> {
        const client = tx || prisma;
        const users = await client.user.findMany({
            include: {
                accounts: true,
            },
        });
        return users as User[];
    }

    async getById(id: string, tx?: Prisma.TransactionClient): Promise<User | null> {
        const client = tx || prisma;
        const user = await client.user.findUnique({
            where: { id },
            include: {
                accounts: true,
            },
        });
        return user as User | null;
    }

    async create(
        data: Omit<User, "id" | "createdAt" | "updatedAt">,
        tx?: Prisma.TransactionClient,
    ): Promise<User> {
        const client = tx || prisma;
        const user = await client.user.create({
            data: {
                ...data,
                accounts: {
                    create: data.accounts,
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            include: {
                accounts: true,
            },
        });
        return user as User;
    }

    async update(
        id: string,
        data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<User> {
        const client = tx || prisma;
        const { accounts, ...userData } = data;

        // Start with the user update
        const user = await client.user.update({
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
        });
        return user as User;
    }

    async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.user.delete({
            where: { id },
        });
    }
}
