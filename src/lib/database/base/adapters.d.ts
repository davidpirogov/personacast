import { Prisma } from "@prisma/client";
import { BaseRecord, UuidRecord } from "@/lib/database/base/models.d";
/**
 * Generic database adapter interface that defines core CRUD operations
 * This should be extended by specific adapters that implement the `getById` method
 * and properly type the ID field (string or number)
 *
 * @template T - Entity type extending BaseRecord
 * @template TId - Type of the ID field (string or number)
 */
export interface DatabaseAdapter<T extends BaseRecord<TId>, TId = number> {
    /**
     * Retrieves all records of type T from the database
     * @param tx - Optional transaction client for running in a transaction
     * @returns Promise resolving to an array of all records
     */
    getAll(tx?: Prisma.TransactionClient): Promise<T[]>;

    /**
     * Creates a new record in the database
     * @param data - Data for creating the record (omitting auto-generated fields)
     * @param tx - Optional transaction client for running in a transaction
     * @returns Promise resolving to the created record
     */
    create(data: Omit<T, "id" | "createdAt" | "updatedAt">, tx?: Prisma.TransactionClient): Promise<T>;

    /**
     * Retrieves a single record by its ID
     * @param id - ID of the record to retrieve
     * @param tx - Optional transaction client for running in a transaction
     * @returns Promise resolving to the record if found, null otherwise
     */
    getById(id: TId, tx?: Prisma.TransactionClient): Promise<T | null>;

    /**
     * Updates an existing record in the database
     * @param id - Unique identifier of the record to update
     * @param data - Partial data containing fields to update
     * @param tx - Optional transaction client for running in a transaction
     * @returns Promise resolving to the updated record
     */
    update(
        id: TId,
        data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
        tx?: Prisma.TransactionClient,
    ): Promise<T>;

    /**
     * Deletes a record from the database
     * @param id - Unique identifier of the record to delete
     * @param tx - Optional transaction client for running in a transaction
     * @returns Promise resolving when the record is deleted
     */
    delete(id: TId, tx?: Prisma.TransactionClient): Promise<void>;
}

/**
 * Database adapter for entities with string/UUID primary keys
 * Convenience type alias for DatabaseAdapter with string IDs
 *
 * @template T - Entity type extending UuidRecord
 */
export type UuidDatabaseAdapter<T extends UuidRecord> = DatabaseAdapter<T, string>;

/**
 * Database adapter for entities with numeric primary keys
 * Convenience type alias for DatabaseAdapter with number IDs
 *
 * @template T - Entity type extending IdRecord
 */
export type IdDatabaseAdapter<T extends IdRecord> = DatabaseAdapter<T, number>;
