import { BaseRecord } from "@/lib/database/base/models.d";

export interface CRUDService<
    T extends BaseRecord<TId>,
    TId = number,
    CreateDTO = Omit<T, "id" | "createdAt" | "updatedAt">,
    UpdateDTO = Partial<CreateDTO>,
> {
    /**
     * List all resources
     */
    list(): Promise<T[]>;

    /**
     * Get a resource by ID
     */
    get(id: TId): Promise<T | null>;

    /**
     * Create a new resource
     */
    create(data: CreateDTO): Promise<T>;

    /**
     * Update an existing resource
     */
    update(id: TId, data: UpdateDTO): Promise<T>;

    /**
     * Delete a resource
     */
    delete(id: TId): Promise<void>;
}

// Convenience type for services with numeric IDs
export type IdCRUDService<
    T extends BaseRecord<number>,
    CreateDTO = Omit<T, "id" | "createdAt" | "updatedAt">,
    UpdateDTO = Partial<CreateDTO>
> = CRUDService<T, number, CreateDTO, UpdateDTO>;

// Convenience type for services with UUID/string IDs
export type UuidCRUDService<
    T extends BaseRecord<string>,
    CreateDTO = Omit<T, "id" | "createdAt" | "updatedAt">,
    UpdateDTO = Partial<CreateDTO>
> = CRUDService<T, string, CreateDTO, UpdateDTO>;
