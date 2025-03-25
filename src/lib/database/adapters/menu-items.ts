import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";
import { MenuItem, MenuItemsAdapterType } from "@/types/database";

export class MenuItemsAdapter implements MenuItemsAdapterType {
    async getAll(tx?: Prisma.TransactionClient): Promise<MenuItem[]> {
        const client = tx || prisma;
        return await client.menuItem.findMany({
            orderBy: { order: "asc" },
        });
    }

    async getById(id: number, tx?: Prisma.TransactionClient): Promise<MenuItem | null> {
        const client = tx || prisma;
        return await client.menuItem.findUnique({
            where: { id },
        });
    }

    async getWithChildren(id: number, tx?: Prisma.TransactionClient): Promise<MenuItem | null> {
        const client = tx || prisma;
        return (await client.menuItem.findUnique({
            where: { id },
            include: {
                children: {
                    orderBy: { order: "asc" },
                },
            },
        })) as MenuItem | null;
    }

    async getTopLevelItems(tx?: Prisma.TransactionClient): Promise<MenuItem[]> {
        const client = tx || prisma;
        return await client.menuItem.findMany({
            where: { parentId: null },
            orderBy: { order: "asc" },
        });
    }

    async getMenuTree(tx?: Prisma.TransactionClient): Promise<MenuItem[]> {
        const client = tx || prisma;
        return (await client.menuItem.findMany({
            where: { parentId: null },
            include: {
                children: {
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        })) as MenuItem[];
    }

    async create(
        data: Omit<MenuItem, "id" | "createdAt" | "updatedAt">,
        tx?: Prisma.TransactionClient,
    ): Promise<MenuItem> {
        const client = tx || prisma;
        const { children, ...createData } = data;
        return await client.menuItem.create({
            data: {
                ...createData,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    async update(
        id: number,
        data: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<MenuItem> {

        console.log("Updating menu item", id, typeof id, data);

        const client = tx || prisma;
        const { children, ...updateData } = data;
        return await client.menuItem.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx || prisma;
        await client.menuItem.delete({
            where: { id },
        });
    }
}
