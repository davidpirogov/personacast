import { z } from "zod";
import { IdSchema } from "@/lib/schemas/base";

/**
 * API Client entity from database
 */
export interface ApiClient {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Data for creating a new API client
 */
export interface ApiClientCreate {
    name: string;
    description: string;
    isActive?: boolean;
}

/**
 * Data for updating an existing API client
 */
export type ApiClientUpdate = Partial<ApiClientCreate>;

/**
 * API response shape for API client
 */
export interface ApiClientResponse {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Special response for API client creation that includes token
 */
export interface ApiClientCreationResponse extends ApiClientResponse {
    token: string;
}

/**
 * API client schema interface
 */
export interface ApiClientSchema
    extends IdSchema<ApiClient, ApiClientCreate, ApiClientUpdate, ApiClientResponse> {
    // Additional schemas specific to API clients
    creationResponse: z.ZodType<ApiClientCreationResponse>;
}

/**
 * Types for API request/response wrappers
 */
export type ApiClientCreateRequest = { data: ApiClientCreate };
export type ApiClientUpdateRequest = { data: ApiClientUpdate };
export type ApiClientSingleResponse = { data: ApiClientResponse };
export type ApiClientListResponse = { data: ApiClientResponse[] };
export type ApiClientCreationSingleResponse = { data: ApiClientCreationResponse };
