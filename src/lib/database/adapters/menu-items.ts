import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { IdAdapter } from "@/lib/database/base/id-adapter";
import { MenuItemsAdapterType } from "@/lib/database/types/adapters.d";
import { MenuItem } from "@/lib/database/types/models.d";

/**
 * Adapter for managing MenuItem entities
 * Using base adapter pattern with overrides for specialized methods
 */
class MenuItemsAdapter extends IdAdapter<MenuItem> implements MenuItemsAdapterType {
    constructor() {
        super("menuItem");
    }

    /**
     * Override getAll to include ordering
     */
    async getAll(tx?: Prisma.TransactionClient): Promise<MenuItem[]> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return await modelClient.findMany({
            orderBy: { order: "asc" },
        }) as MenuItem[];
    }

    /**
     * Get a menu item with its children
     */
    async getWithChildren(id: number, tx?: Prisma.TransactionClient): Promise<MenuItem | null> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return await modelClient.findUnique({
            where: { id },
            include: {
                children: {
                    orderBy: { order: "asc" },
                },
            },
        }) as MenuItem | null;
    }

    /**
     * Get top-level menu items (with no parent)
     */
    async getTopLevelItems(tx?: Prisma.TransactionClient): Promise<MenuItem[]> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return await modelClient.findMany({
            where: { parentId: null },
            orderBy: { order: "asc" },
        }) as MenuItem[];
    }

    /**
     * Get the full menu tree (top-level items with their children)
     */
    async getMenuTree(tx?: Prisma.TransactionClient): Promise<MenuItem[]> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        return await modelClient.findMany({
            where: { parentId: null },
            include: {
                children: {
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        }) as MenuItem[];
    }

    /**
     * Override create to handle children property
     */
    async create(
        data: Omit<MenuItem, "id" | "createdAt" | "updatedAt">,
        tx?: Prisma.TransactionClient,
    ): Promise<MenuItem> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        const { children, ...createData } = data;
        const preparedData = this.prepareCreateData(createData);
        return await modelClient.create({
            data: preparedData,
        }) as MenuItem;
    }

    /**
     * Override update to handle children property
     */
    async update(
        id: number,
        data: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<MenuItem> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        const { children, ...updateData } = data;
        const preparedData = this.prepareUpdateData(updateData);
        return await modelClient.update({
            where: { id },
            data: preparedData,
        }) as MenuItem;
    }

    // async getById(id: number, tx?: Prisma.TransactionClient): Promise<MenuItem | null> {
    //     const client = tx || db;
    //     return await client.menuItem.findUnique({
    //         where: { id },
    //     });
    // }

    // async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    //     const client = tx || db;
    //     await client.menuItem.delete({
    //         where: { id },
    //     });
    // }
}

export default MenuItemsAdapter;
