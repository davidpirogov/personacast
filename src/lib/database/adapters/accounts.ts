import { PrismaClient, Prisma } from "@prisma/client";
import { Account, AccountsAdapterType } from "@/types/database";

const prisma = new PrismaClient();

export class AccountsAdapter implements AccountsAdapterType {
    async getAll(tx?: Prisma.TransactionClient): Promise<Account[]> {
        const client = tx || prisma;
        const accounts = await client.account.findMany();
        return accounts as Account[];
    }

    async getById(id: string, tx?: Prisma.TransactionClient): Promise<Account | null> {
        const client = tx || prisma;
        const account = await client.account.findUnique({
            where: { id },
        });
        return account as Account | null;
    }

    async create(
        data: Omit<Account, "id" | "created_at" | "updated_at">,
        tx?: Prisma.TransactionClient,
    ): Promise<Account> {
        const client = tx || prisma;
        const account = await client.account.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return account as Account;
    }

    async update(
        id: string,
        data: Partial<Omit<Account, "id" | "created_at" | "updated_at">>,
        tx?: Prisma.TransactionClient,
    ): Promise<Account> {
        const client = tx || prisma;
        const account = await client.account.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
        return account as Account;
    }

    async delete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.account.delete({
            where: { id },
        });
    }

    // Additional methods specific to accounts
    async findByProvider(
        provider: string,
        providerAccountId: string,
        tx?: Prisma.TransactionClient,
    ): Promise<Account | null> {
        const client = tx || prisma;
        const account = await client.account.findFirst({
            where: {
                provider,
                providerAccountId,
            },
        });
        return account as Account | null;
    }

    async deleteByUserId(userId: string, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.account.deleteMany({
            where: { userId },
        });
    }
}
