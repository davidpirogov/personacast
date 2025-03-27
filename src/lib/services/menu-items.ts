import { MenuItem } from "@/lib/database/types/models.d";
import MenuItemsAdapter from "@/lib/database/adapters/menu-items";
import { MenuItemsService } from "./menu-items.d";
import { IdService } from "./base";
import { OptimizedHeroImage } from "./hero-images";

/**
 * Implementation of MenuItemsService using the base service pattern
 */
class MenuItemsServiceImpl extends IdService<MenuItem> implements MenuItemsService {
    constructor() {
        super(new MenuItemsAdapter());
    }

    /**
     * Get a menu item by ID with its children
     */
    async getWithChildren(id: number): Promise<MenuItem | null> {
        return (this.adapter as any).getWithChildren(id);
    }

    /**
     * Get all top-level menu items (those without a parent)
     */
    async getTopLevelItems(): Promise<MenuItem[]> {
        return (this.adapter as any).getTopLevelItems();
    }

    /**
     * Get all menu items organized in a hierarchical structure
     */
    async getMenuTree(): Promise<MenuItem[]> {
        return (this.adapter as any).getMenuTree();
    }

    /**
     * Override create to handle order assignment
     */
    async create(data: Omit<MenuItem, "id" | "createdAt" | "updatedAt">): Promise<MenuItem> {
        // If no order is provided, add to the end
        if (data.order === undefined) {
            const items = await this.list();
            const maxOrder = items.reduce((max, item) => Math.max(max, item.order), 0);
            data.order = maxOrder + 1;
        }

        return super.create(data);
    }

    /**
     * Override delete to prevent deletion of system menu items
     */
    async delete(id: number): Promise<void> {
        const item = await this.get(id);

        if (item && item.isSystem) {
            throw new Error("Cannot delete system menu item");
        }

        await super.delete(id);
    }

    /**
     * Reorder menu items
     */
    async reorderItems(items: { id: number; order: number }[]): Promise<void> {
        // Get all menu items
        const allItems = await this.list();

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
            await this.update(item.id, { order: item.order });
        }
    }
}

// Export a singleton instance
export const menuItemsService = new MenuItemsServiceImpl();

// Export the interface for better type inference
export type { MenuItemsService };
