import { IdDatabaseAdapter, UuidDatabaseAdapter } from "@/lib/database/base/adapters.d";
import { IdRecord, UuidRecord } from "@/lib/database/base/models.d";
import { IdService } from "@/lib/services/base/id-service";
import { UuidService } from "@/lib/services/base/uuid-service";
import { IdCRUDService, UuidCRUDService } from "@/lib/services/base/services.d";

/**
 * Factory for creating ID-based services
 * 
 * @template T - Entity type extending IdRecord
 * @template TAdapter - Adapter type extending IdDatabaseAdapter<T>
 * @param adapter - The adapter instance
 * @returns A new IdService instance for the entity
 */
export function createIdService<
    T extends IdRecord,
    TAdapter extends IdDatabaseAdapter<T>
>(adapter: TAdapter): IdCRUDService<T> {
    return new IdService<T, TAdapter>(adapter);
}

/**
 * Factory for creating UUID-based services
 * 
 * @template T - Entity type extending UuidRecord
 * @template TAdapter - Adapter type extending UuidDatabaseAdapter<T>
 * @param adapter - The adapter instance
 * @returns A new UuidService instance for the entity
 */
export function createUuidService<
    T extends UuidRecord,
    TAdapter extends UuidDatabaseAdapter<T>
>(adapter: TAdapter): UuidCRUDService<T> {
    return new UuidService<T, TAdapter>(adapter);
} 