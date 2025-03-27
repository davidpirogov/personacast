import { z } from "zod";
import { BaseRecord, IdRecord, UuidRecord } from "@/lib/database/base/models.d";
import { BaseSchema, IdSchema, UuidSchema } from "@/lib/schemas/base/schema-types.d";

/**
 * Factory function to create a base schema for any entity type
 *
 * @param baseFields - Base fields common to all schemas (validated on both create/update)
 * @param idType - Type of ID field ('number' or 'string')
 * @param responseFields - Fields to include in the response (defaults to all fields)
 * @returns A schema object implementing BaseSchema interface
 */
export function createBaseSchema<
    T extends BaseRecord<TId>,
    TId extends string | number = number,
    TCreate = Omit<T, "id" | "createdAt" | "updatedAt">,
    TUpdate = Partial<TCreate>,
    TResponse = T,
>(
    baseFields: Record<string, z.ZodTypeAny>,
    idType: "number" | "string" = "number",
    responseOptions: {
        excludeFields?: (keyof T)[];
        includeFields?: (keyof T | string)[];
        transform?: (data: T) => TResponse;
    } = {},
): BaseSchema<T, TId, TCreate, TUpdate, TResponse> {
    // Create the base object schema from provided fields
    const baseSchema = z.object(baseFields);

    // ID field based on type
    const idField = idType === "number" ? z.number().int().positive() : z.string().uuid();

    // Complete model schema with all fields
    const modelSchema = baseSchema.extend({
        id: idField as unknown as z.ZodType<TId>,
        createdAt: z.date(),
        updatedAt: z.date(),
    }) as unknown as z.ZodType<T>;

    // Create schema (without id and timestamps)
    const createSchema = baseSchema as unknown as z.ZodType<TCreate>;

    // Update schema (partial fields)
    const updateSchema = baseSchema.partial() as unknown as z.ZodType<TUpdate>;

    // Response schema (potentially filtered/transformed)
    let responseSchema: z.ZodType<any>;

    if (responseOptions.transform) {
        // Use transform function if provided
        responseSchema = modelSchema.transform(responseOptions.transform);
    } else if (responseOptions.excludeFields?.length) {
        // Create a new schema excluding specified fields
        const fieldsToInclude = Object.keys(baseFields).reduce(
            (acc, key) => {
                if (!responseOptions.excludeFields?.includes(key as keyof T)) {
                    acc[key] = baseFields[key];
                }
                return acc;
            },
            {} as Record<string, z.ZodTypeAny>,
        );

        // Add back id and timestamps unless excluded
        if (!responseOptions.excludeFields.includes("id" as keyof T)) {
            fieldsToInclude.id = idField as unknown as z.ZodType<TId>;
        }
        if (!responseOptions.excludeFields.includes("createdAt" as keyof T)) {
            fieldsToInclude.createdAt = z.date();
        }
        if (!responseOptions.excludeFields.includes("updatedAt" as keyof T)) {
            fieldsToInclude.updatedAt = z.date();
        }

        responseSchema = z.object(fieldsToInclude);
    } else {
        // By default, use the model schema
        responseSchema = modelSchema;
    }

    // List response schema
    const listResponseSchema = z.array(responseSchema);

    return {
        model: modelSchema,
        create: createSchema,
        update: updateSchema,
        response: responseSchema,
        listResponse: listResponseSchema,
    };
}

/**
 * Creates a schema for entities with numeric IDs
 */
export function createIdSchema<
    T extends IdRecord,
    TCreate = Omit<T, "id" | "createdAt" | "updatedAt">,
    TUpdate = Partial<TCreate>,
    TResponse = T,
>(
    baseFields: Record<string, z.ZodTypeAny>,
    responseOptions?: {
        excludeFields?: (keyof T)[];
        includeFields?: (keyof T | string)[];
        transform?: (data: T) => TResponse;
    },
): IdSchema<T, TCreate, TUpdate, TResponse> {
    return createBaseSchema<T, number, TCreate, TUpdate, TResponse>(
        baseFields,
        "number",
        responseOptions,
    ) as IdSchema<T, TCreate, TUpdate, TResponse>;
}

/**
 * Creates a schema for entities with UUID/string IDs
 */
export function createUuidSchema<
    T extends UuidRecord,
    TCreate = Omit<T, "id" | "createdAt" | "updatedAt">,
    TUpdate = Partial<TCreate>,
    TResponse = T,
>(
    baseFields: Record<string, z.ZodTypeAny>,
    responseOptions?: {
        excludeFields?: (keyof T)[];
        includeFields?: (keyof T | string)[];
        transform?: (data: T) => TResponse;
    },
): UuidSchema<T, TCreate, TUpdate, TResponse> {
    return createBaseSchema<T, string, TCreate, TUpdate, TResponse>(
        baseFields,
        "string",
        responseOptions,
    ) as UuidSchema<T, TCreate, TUpdate, TResponse>;
}

/**
 * Creates standard wrapper schemas for requests and responses
 */
export function createWrappers<T>(schema: z.ZodType<T>) {
    // Request wrapper
    const requestWrapper = z.object({
        data: schema,
    });

    // Response wrapper (single item)
    const responseWrapper = z.object({
        data: schema,
        meta: z.record(z.unknown()).optional(),
    });

    // Response wrapper (list)
    const listResponseWrapper = z.object({
        data: z.array(schema),
        meta: z.record(z.unknown()).optional(),
    });

    // Paginated response
    const paginationMeta = z.object({
        currentPage: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalItems: z.number().int().nonnegative(),
        totalPages: z.number().int().nonnegative(),
    });

    const paginatedResponseWrapper = z.object({
        data: z.array(schema),
        meta: paginationMeta,
    });

    return {
        requestWrapper,
        responseWrapper,
        listResponseWrapper,
        paginatedResponseWrapper,
    };
}
