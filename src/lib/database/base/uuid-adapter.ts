import { Prisma } from "@prisma/client";
import { BaseAdapter } from "@/lib/database/base/base-adapter";
import { UuidRecord } from "@/lib/database/base/models.d";
import { UuidDatabaseAdapter } from "@/lib/database/base/adapters.d";

/**
 * Concrete implementation of BaseAdapter for entities with string/UUID primary keys
 * 
 * @template T - Entity type extending UuidRecord (with string ID)
 */
export class UuidAdapter<T extends UuidRecord> extends BaseAdapter<T, string> implements UuidDatabaseAdapter<T> {
    /**
     * Creates a new UuidAdapter instance
     * 
     * @param modelName - The name of the Prisma model (e.g., "user", "account")
     */
    constructor(modelName: string) {
        super(modelName);
    }
} 