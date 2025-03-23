import { z } from "zod";

export const variableSchema = z.object({
    name: z.string().min(1, "Name is required"),
    value: z.string().min(1, "Value is required"),
});

export type VariableFormData = z.infer<typeof variableSchema>;

export const variableResponseSchema = variableSchema.extend({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type VariableResponse = z.infer<typeof variableResponseSchema>; 