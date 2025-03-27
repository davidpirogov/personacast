import { UuidDatabaseAdapter } from "@/lib/database/base/adapters.d";
import { UuidRecord } from "@/lib/database/base/models.d";
import { BaseService } from "@/lib/services/base/base-service";
import { UuidCRUDService } from "@/lib/services/base/services.d";

/**
 * Service for entities with string/UUID primary keys.
 * 
 * @template T - Entity type extending UuidRecord (with string ID)
 * @template TAdapter - Type of the database adapter for the entity
 */
export class UuidService<
    T extends UuidRecord,
    TAdapter extends UuidDatabaseAdapter<T> = UuidDatabaseAdapter<T>
> extends BaseService<T, string, TAdapter> implements UuidCRUDService<T> {
    
    /**
     * Creates a new UuidService instance
     * 
     * @param adapter - The database adapter for the entity
     */
    constructor(adapter: TAdapter) {
        super(adapter);
    }
} 