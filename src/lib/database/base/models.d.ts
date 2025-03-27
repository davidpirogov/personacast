import { Prisma } from "@prisma/client";

/**
 * Base record interface with common fields for database entities.
 * All database models should extend this interface to ensure consistency.
 *
 * @template TId - Type of the ID field (string or number)
 */
export interface BaseRecord<TId = number> {
    /** Unique identifier for the record */
    id: TId;
    /** Date when the record was created */
    createdAt: Date;
    /** Date when the record was last updated */
    updatedAt: Date;
}

export interface UuidRecord extends BaseRecord<string> {}
export interface IdRecord extends BaseRecord<number> {}
