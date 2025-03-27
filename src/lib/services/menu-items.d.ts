import { MenuItem } from "@/lib/database/types/models.d";
import { IdCRUDService } from "@/lib/services/base/services.d";

export interface MenuItemsService extends IdCRUDService<MenuItem> {
    /**
     * Get a menu item by ID with its children
     */
    getWithChildren(id: number): Promise<MenuItem | null>;

    /**
     * Get all top-level menu items (those without a parent)
     */
    getTopLevelItems(): Promise<MenuItem[]>;

    /**
     * Get all menu items organized in a hierarchical structure
     */
    getMenuTree(): Promise<MenuItem[]>;

    /**
     * Reorder menu items
     */
    reorderItems(items: { id: number; order: number }[]): Promise<void>;

    /**
     * Get a menu item by ID
     */
    get(id: number): Promise<MenuItem | null>;

    /**
     * Create a new menu item
     */
    create(data: Omit<MenuItem, "id" | "createdAt" | "updatedAt">): Promise<MenuItem>;

    /**
     * Update an existing menu item
     */
    update(id: number, data: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>): Promise<MenuItem>;

    /**
     * Delete a menu item
     */
    delete(id: number): Promise<void>;
} 