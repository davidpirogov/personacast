import { MenuItemsAdapter } from "@/lib/database/adapters/menu-items";
import { MenuItem, MenuItemsAdapterType } from "@/types/database";
import { MenuItemsService } from "@/types/services";

export class DefaultMenuItemsService implements MenuItemsService {
    private adapter: MenuItemsAdapterType;

    constructor() {
        this.adapter = new MenuItemsAdapter();
    }

    async list(): Promise<MenuItem[]> {
        return this.adapter.getAll();
    }

    async get(id: number): Promise<MenuItem | null> {
        return this.adapter.getById(id);
    }

    async getWithChildren(id: number): Promise<MenuItem | null> {
        return this.adapter.getWithChildren(id);
    }

    async getTopLevelItems(): Promise<MenuItem[]> {
        return this.adapter.getTopLevelItems();
    }

    async getMenuTree(): Promise<MenuItem[]> {
        return this.adapter.getMenuTree();
    }

    async create(data: Omit<MenuItem, "id" | "createdAt" | "updatedAt">): Promise<MenuItem> {
        // If no order is provided, add to the end
        if (data.order === undefined) {
            const items = await this.adapter.getAll();
            const maxOrder = items.reduce((max, item) => Math.max(max, item.order), 0);
            data.order = maxOrder + 1;
        }

        return this.adapter.create(data);
    }

    async update(
        id: number,
        data: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>,
    ): Promise<MenuItem> {
        return this.adapter.update(id, data);
    }

    async delete(id: number): Promise<void> {
        const item = await this.adapter.getById(id);

        if (item && item.isSystem) {
            throw new Error("Cannot delete system menu item");
        }

        await this.adapter.delete(id);
    }

    async reorderItems(items: { id: number; order: number }[]): Promise<void> {
        // Get all menu items
        const allItems = await this.adapter.getAll();

        // First perform the swaps for the items being reordered
        const itemsToUpdate = [...allItems];
        for (const { id, order } of items) {
            const itemIndex = itemsToUpdate.findIndex((item) => item.id === id);
            if (itemIndex !== -1) {
                itemsToUpdate[itemIndex] = { ...itemsToUpdate[itemIndex], order };
            }
        }

        // Sort by order to get the final positions
        itemsToUpdate.sort((a, b) => a.order - b.order);

        // Normalize orders starting from 100 while maintaining positions
        const updatedItems = itemsToUpdate.map((item, index) => ({
            id: item.id,
            order: 100 + index,
        }));

        // Update all items with their new normalized order
        for (const item of updatedItems) {
            await this.adapter.update(item.id, { order: item.order });
        }
    }
}

export const menuItemsService = new DefaultMenuItemsService();
