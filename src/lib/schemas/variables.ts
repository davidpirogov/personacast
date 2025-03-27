import { z } from "zod";
import { createIdSchema, createWrappers } from "@/lib/schemas/base";
import { stringValidators } from "@/lib/schemas/base/schema-utils";
import { Variable, VariableCreate, VariableSchema, VariableUpdate } from "@/lib/schemas/variables.d";

// Base fields for the variable entity
const variableBaseFields = {
    name: stringValidators.required("Name is required"),
    value: stringValidators.required("Value is required"),
};

// Create the schema using the factory function
export const variableSchema: VariableSchema = createIdSchema<Variable, VariableCreate, VariableUpdate>(
    variableBaseFields,
);

// Create standard wrapper schemas
const wrappers = createWrappers(variableSchema.response);

// Export schemas
export const schemas = {
    // Core schemas
    model: variableSchema.model,
    create: variableSchema.create,
    update: variableSchema.update,
    response: variableSchema.response,
    list: variableSchema.listResponse,

    // Wrapped schemas for API endpoints
    createRequest: wrappers.requestWrapper,
    updateRequest: wrappers.requestWrapper,
    singleResponse: wrappers.responseWrapper,
    listResponse: wrappers.listResponseWrapper,
};

// Type exports for backward compatibility
export type VariableFormData = VariableCreate;
export type VariableResponse = z.infer<typeof variableSchema.response>;
