import { z } from "zod";

// Base schema for API client fields
const apiClientBase = {
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    isActive: z.boolean().default(true),
};

// Request schemas
export const createApiClientSchema = z.object({
    ...apiClientBase,
});

export const updateApiClientSchema = z.object({
    ...apiClientBase,
}).partial();

// Response schemas with field selection
export const apiClientResponseFields = {
    id: true,
    name: true,
    description: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
} as const;

// Special response fields for initial creation that includes token
export const apiClientCreationResponseFields = {
    ...apiClientResponseFields,
    token: true,
} as const;

// Type for selecting response fields
export type ApiClientSelect = Partial<typeof apiClientResponseFields>;

// Helper to create a response schema based on selected fields
export function createApiClientResponseSchema(select: ApiClientSelect = apiClientResponseFields) {
    return z.object({
        ...(select.id && { id: z.number() }),
        ...(select.name && { name: z.string() }),
        ...(select.description && { description: z.string() }),
        ...(select.isActive && { isActive: z.boolean() }),
        ...(select.createdAt && { createdAt: z.date() }),
        ...(select.updatedAt && { updatedAt: z.date() }),
    });
}

// Special schema for initial creation response that includes token
export const apiClientCreationResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    token: z.string(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Types inferred from schemas
export type CreateApiClientRequest = z.infer<typeof createApiClientSchema>;
export type UpdateApiClientRequest = z.infer<typeof updateApiClientSchema>;
export type ApiClientResponse = z.infer<ReturnType<typeof createApiClientResponseSchema>>;
export type ApiClientCreationResponse = z.infer<typeof apiClientCreationResponseSchema>;

// Response wrapper schemas
export const apiClientListResponseSchema = z.object({
    clients: z.array(createApiClientResponseSchema()),
});

export const apiClientSingleResponseSchema = z.object({
    client: createApiClientResponseSchema(),
});

export const apiClientCreationSingleResponseSchema = z.object({
    client: apiClientCreationResponseSchema,
});

export type ApiClientListResponse = z.infer<typeof apiClientListResponseSchema>;
export type ApiClientSingleResponse = z.infer<typeof apiClientSingleResponseSchema>;
export type ApiClientCreationSingleResponse = z.infer<typeof apiClientCreationSingleResponseSchema>; 