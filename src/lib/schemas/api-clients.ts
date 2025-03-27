import { z } from "zod";
import { createIdSchema, createWrappers } from "./base";
import { booleanValidators, stringValidators } from "./base/schema-utils";
import {
    ApiClient,
    ApiClientCreate,
    ApiClientUpdate,
    ApiClientSchema as ApiClientSchemaType,
} from "@/lib/schemas/api-clients.d";

// Base fields for the API client entity
const apiClientBaseFields = {
    name: stringValidators.required("Name is required"),
    description: stringValidators.required("Description is required"),
    isActive: booleanValidators.defaultTrue(),
};

// Create the schema using the factory function
const baseSchema = createIdSchema<ApiClient, ApiClientCreate, ApiClientUpdate>(apiClientBaseFields);

// Special schema for creation response that includes token
const apiClientCreationResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    token: z.string(),
});

// Complete schema with all API client schemas
export const apiClientSchema: ApiClientSchemaType = {
    ...baseSchema,
    creationResponse: apiClientCreationResponseSchema,
};

// Create standard wrapper schemas for regular responses
const wrappers = createWrappers(apiClientSchema.response);

// Special wrapper for creation response
const creationWrappers = createWrappers(apiClientSchema.creationResponse);

// Export schemas
export const schemas = {
    // Core schemas
    model: apiClientSchema.model,
    create: apiClientSchema.create,
    update: apiClientSchema.update,
    response: apiClientSchema.response,
    list: apiClientSchema.listResponse,
    creationResponse: apiClientSchema.creationResponse,

    // Wrapped schemas for API endpoints
    createRequest: wrappers.requestWrapper,
    updateRequest: wrappers.requestWrapper,
    singleResponse: wrappers.responseWrapper,
    listResponse: wrappers.listResponseWrapper,
    creationSingleResponse: creationWrappers.responseWrapper,
};

// Type exports for backward compatibility
export type CreateApiClientRequest = ApiClientCreate;
export type UpdateApiClientRequest = ApiClientUpdate;
export type ApiClientResponse = z.infer<typeof apiClientSchema.response>;
export type ApiClientCreationResponse = z.infer<typeof apiClientSchema.creationResponse>;
export type ApiClientListResponse = z.infer<typeof schemas.listResponse>;
export type ApiClientSingleResponse = z.infer<typeof schemas.singleResponse>;
export type ApiClientCreationSingleResponse = z.infer<typeof schemas.creationSingleResponse>;
export type ApiClientSchema = z.infer<typeof apiClientSchema.model>;
