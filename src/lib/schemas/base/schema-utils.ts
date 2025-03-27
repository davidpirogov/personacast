import { z } from "zod";

/**
 * Common validation patterns and reusable validators
 */

// String validators
export const stringValidators = {
    /** Required string (non-empty) */
    required: (message = "Field is required") => z.string().min(1, message),

    /** Optional string (can be empty or undefined) */
    optional: () => z.string().optional(),

    /** Email validator */
    email: (message = "Invalid email format") => z.string().email(message),

    /** URL validator */
    url: (message = "Invalid URL format") => z.string().url(message),

    /** UUID validator */
    uuid: (message = "Invalid UUID format") => z.string().uuid(message),

    /** String with max length */
    maxLength: (max: number, message?: string) =>
        z.string().max(max, message || `Maximum length is ${max} characters`),

    /** String with specific length */
    length: (length: number, message?: string) =>
        z.string().length(length, message || `Must be exactly ${length} characters`),
};

// Number validators
export const numberValidators = {
    /** Positive integer */
    positiveInt: (message = "Must be a positive integer") => z.number().int().positive(message),

    /** Non-negative integer (zero or positive) */
    nonNegativeInt: (message = "Must be zero or a positive integer") => z.number().int().nonnegative(message),

    /** Integer in range */
    intRange: (min: number, max: number, message?: string) =>
        z.number().int().gte(min, message).lte(max, message),

    /** Optional number */
    optional: () => z.number().optional(),

    /** Price (two decimal places) */
    price: (message = "Invalid price format") =>
        z.number().multipleOf(0.01, message).nonnegative("Price must be positive"),
};

// Boolean validators
export const booleanValidators = {
    /** Default boolean (defaults to false) */
    defaultFalse: () => z.boolean().default(false),

    /** Default boolean (defaults to true) */
    defaultTrue: () => z.boolean().default(true),

    /** Optional boolean */
    optional: () => z.boolean().optional(),
};

// Date validators
export const dateValidators = {
    /** Future date */
    future: (message = "Date must be in the future") => z.date().refine((date) => date > new Date(), message),

    /** Past date */
    past: (message = "Date must be in the past") => z.date().refine((date) => date < new Date(), message),

    /** Optional date */
    optional: () => z.date().optional(),

    /** Date string that converts to Date object */
    dateString: () =>
        z
            .string()
            .datetime()
            .transform((str) => new Date(str)),
};

/**
 * Transforms raw data objects to properly formatted entities
 */
export const transformers = {
    /** Transform string date fields to Date objects */
    dateFields: (data: Record<string, any>, dateFields: string[]) => {
        const result = { ...data };

        for (const field of dateFields) {
            if (result[field] && typeof result[field] === "string") {
                result[field] = new Date(result[field]);
            }
        }

        return result;
    },

    /** Remove specified fields from an object */
    excludeFields: <T extends Record<string, any>>(data: T, fields: (keyof T)[]): Partial<T> => {
        const result = { ...data };

        for (const field of fields) {
            delete result[field];
        }

        return result;
    },
};
