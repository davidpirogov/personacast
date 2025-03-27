import { Prisma } from "@prisma/client";
import { BaseAdapter } from "@/lib/database/base/base-adapter";
import { IdRecord } from "@/lib/database/base/models.d";
import { IdDatabaseAdapter } from "@/lib/database/base/adapters.d";

/**
 * Concrete implementation of BaseAdapter for entities with numeric ID primary keys
 * 
 * @template T - Entity type extending IdRecord (with numeric ID)
 */
export class IdAdapter<T extends IdRecord> extends BaseAdapter<T, number> implements IdDatabaseAdapter<T> {
    /**
     * Creates a new IdAdapter instance
     * 
     * @param modelName - The name of the Prisma model (e.g., "podcast", "menuItem")
     */
    constructor(modelName: string) {
        super(modelName);
    }
} 