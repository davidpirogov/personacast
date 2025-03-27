import { z } from "zod";
import { IdSchema } from "./base";

/**
 * Variable entity from database
 */
export interface Variable {
    id: number;
    name: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Data for creating a new variable
 */
export interface VariableCreate {
    name: string;
    value: string;
}

/**
 * Data for updating an existing variable
 */
export type VariableUpdate = Partial<VariableCreate>;

/**
 * API response shape for variable
 */
export interface VariableResponse {
    id: number;
    name: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Variable schema interface
 */
export interface VariableSchema
    extends IdSchema<Variable, VariableCreate, VariableUpdate, VariableResponse> {}

/**
 * Types for API request/response wrappers
 */
export type VariableCreateRequest = { data: VariableCreate };
export type VariableUpdateRequest = { data: VariableUpdate };
export type VariableSingleResponse = { data: VariableResponse };
export type VariableListResponse = { data: VariableResponse[] };
