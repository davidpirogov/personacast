import { DatabaseAdapter } from "@/lib/database/base/adapters.d";
import { BaseRecord } from "@/lib/database/base/models.d";
import { CRUDService } from "@/lib/services/base/services.d";

/**
 * Base service abstract class that implements common CRUD operations
 * for domain services. Delegates operations to the appropriate database adapter.
 *
 * @template T - Entity type extending BaseRecord
 * @template TId - Type of the ID field (string or number)
 * @template TAdapter - Type of the database adapter that handles data access
 */
export abstract class BaseService<
    T extends BaseRecord<TId>,
    TId = number,
    TAdapter extends DatabaseAdapter<T, TId> = DatabaseAdapter<T, TId>,
> implements
        CRUDService<
            T,
            TId,
            Omit<T, "id" | "createdAt" | "updatedAt">,
            Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
        >
{
    /**
     * Creates a new BaseService instance
     *
     * @param adapter - The database adapter to use for data access
     */
    constructor(protected readonly adapter: TAdapter) {}

    /**
     * Lists all resources of type T
     * @returns Promise resolving to an array of all resources
     */
    async list(): Promise<T[]> {
        return await this.adapter.getAll();
    }

    /**
     * Gets a resource by ID
     * @param id - ID of the resource to retrieve
     * @returns Promise resolving to the resource if found, null otherwise
     */
    async get(id: TId): Promise<T | null> {
        return await this.adapter.getById(id);
    }

    /**
     * Creates a new resource
     * @param data - Data for creating the resource (omitting auto-generated fields)
     * @returns Promise resolving to the created resource
     */
    async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
        return await this.adapter.create(data);
    }

    /**
     * Updates an existing resource
     * @param id - Unique identifier of the resource to update
     * @param data - Partial data containing fields to update
     * @returns Promise resolving to the updated resource
     */
    async update(id: TId, data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): Promise<T> {
        return await this.adapter.update(id, data);
    }

    /**
     * Deletes a resource
     * @param id - Unique identifier of the resource to delete
     * @returns Promise resolving when the resource is deleted
     */
    async delete(id: TId): Promise<void> {
        await this.adapter.delete(id);
    }
}
