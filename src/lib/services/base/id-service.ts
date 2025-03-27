import { IdDatabaseAdapter } from "@/lib/database/base/adapters.d";
import { IdRecord } from "@/lib/database/base/models.d";
import { BaseService } from "@/lib/services/base/base-service";
import { IdCRUDService } from "@/lib/services/base/services.d";

/**
 * Service for entities with numeric ID primary keys.
 * 
 * @template T - Entity type extending IdRecord (with numeric ID)
 * @template TAdapter - Type of the database adapter for the entity
 */
export class IdService<
    T extends IdRecord,
    TAdapter extends IdDatabaseAdapter<T> = IdDatabaseAdapter<T>
> extends BaseService<T, number, TAdapter> implements IdCRUDService<T> {
    
    /**
     * Creates a new IdService instance
     * 
     * @param adapter - The database adapter for the entity
     */
    constructor(adapter: TAdapter) {
        super(adapter);
    }
} 