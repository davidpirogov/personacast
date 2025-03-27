import { Prisma } from "@prisma/client";
import { db } from "@/lib/database/prisma";
import { IdAdapter } from "@/lib/database/base/id-adapter";
import { MenuItem } from "@/lib/database/types/models.d";
import { MenuItemsAdapterType } from "@/lib/database/types/adapters.d";

/**
 * Example adapter implementation for MenuItem that overrides the create method 
 * and implements specialized methods
 */
class MenuItemsAdapter extends IdAdapter<MenuItem> implements MenuItemsAdapterType {
    constructor() {
        super("menuItem");
    }

    /**
     * Override the create method to handle nested children
     * @param data - MenuItem data including optional children
     * @param tx - Optional transaction client 
     * @returns Promise resolving to the created MenuItem
     */
    async create(
        data: Omit<MenuItem, "id" | "createdAt" | "updatedAt">,
        tx?: Prisma.TransactionClient,
    ): Promise<MenuItem> {
        const client = tx || db;
        const modelClient = this.getModelClient(client);
        
        // Extract children to handle separately
        const { children, ...createData } = data;
        
        // Use the base implementation's prepareCreateData method to add timestamps
        const preparedData = this.prepareCreateData(createData);
        
        return await modelClient.create({
            data: preparedData,
        }) as MenuItem;
    }

    /**
     * Get menu item with its children
     * @param id - MenuItem ID
     * @param tx - Optional transaction client
     * @returns Promise resolving to the MenuItem with children if found, null otherwise
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
     * @param tx - Optional transaction client
     * @returns Promise resolving to an array of top-level MenuItems
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
     * @param tx - Optional transaction client
     * @returns Promise resolving to an array of top-level MenuItems with children
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
}

export default MenuItemsAdapter; 