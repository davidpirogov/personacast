import { z } from "zod";
import { BaseRecord } from "@/lib/database/base/models.d";

/**
 * Base schema interface that defines core schema operations
 * @template T - Model type (database entity)
 * @template TId - ID type (string or number)
 * @template TCreate - Create DTO type
 * @template TUpdate - Update DTO type
 * @template TResponse - Response type (what is sent to client)
 */
export interface BaseSchema<
  T extends BaseRecord<TId>,
  TId = number,
  TCreate = Omit<T, "id" | "createdAt" | "updatedAt">,
  TUpdate = Partial<TCreate>,
  TResponse = T
> {
  /** Schema for the full model with all fields */
  model: z.ZodType<T>;
  
  /** Schema for creating a new entity (without id, timestamps) */
  create: z.ZodType<TCreate>;
  
  /** Schema for updating an entity (partial fields) */
  update: z.ZodType<TUpdate>;
  
  /** Schema for single entity response */
  response: z.ZodType<TResponse>;
  
  /** Schema for list of entities response */
  listResponse: z.ZodType<TResponse[]>;
}

/**
 * Schema interface for entities with numeric IDs
 */
export interface IdSchema<
  T extends BaseRecord<number>,
  TCreate = Omit<T, "id" | "createdAt" | "updatedAt">,
  TUpdate = Partial<TCreate>,
  TResponse = T
> extends BaseSchema<T, number, TCreate, TUpdate, TResponse> {}

/**
 * Schema interface for entities with UUID/string IDs
 */
export interface UuidSchema<
  T extends BaseRecord<string>,
  TCreate = Omit<T, "id" | "createdAt" | "updatedAt">,
  TUpdate = Partial<TCreate>,
  TResponse = T
> extends BaseSchema<T, string, TCreate, TUpdate, TResponse> {}

/**
 * Request wrapper interface for standardizing API request objects
 */
export interface RequestWrapper<T> {
  data: T;
}

/**
 * Response wrapper interface for standardizing API response objects
 */
export interface ResponseWrapper<T> {
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Paginated response wrapper interface
 */
export interface PaginatedResponseWrapper<T> extends ResponseWrapper<T[]> {
  meta: PaginationMeta;
} 