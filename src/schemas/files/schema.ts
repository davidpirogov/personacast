import { z } from "zod";

// Internal base schema with all fields including path
const fileMetadataCompleteSchema = z.object({
    name: z.string().min(1, "Name is required"),
    path: z.string().min(1, "Path is required"),
    size: z.number().int().positive("Size must be a positive number"),
    mimeType: z.string().min(1, "MIME type is required"),
    extension: z.string().max(48, "Extension must be at most 48 characters"),
    width: z.number().int().positive().nullable(),
    height: z.number().int().positive().nullable(),
    duration: z.number().int().positive().nullable(),
    url: z.string().min(1, "URL is required"),
});

// Client-facing base schema (without path)
const fileMetadataBaseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    size: z.number().int().positive("Size must be a positive number"),
    mimeType: z.string().min(1, "MIME type is required"),
    extension: z.string().max(48, "Extension must be at most 48 characters"),
    width: z.number().int().positive().nullable(),
    height: z.number().int().positive().nullable(),
    duration: z.number().int().positive().nullable(),
    url: z.string().min(1, "URL is required"),
});

// Schema for complete file metadata with all fields (internal)
const fileMetadataInternalSchema = fileMetadataCompleteSchema.extend({
    id: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Schema for complete file metadata (client-facing)
const fileMetadataSchema = fileMetadataBaseSchema.extend({
    id: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// List response schema (client-facing)
export const fileMetadataListResponseSchema = z.array(fileMetadataSchema);

// Create request schema (internal use)
export const fileMetadataCreateRequestSchema = fileMetadataInternalSchema;
export type FileMetadataCreateRequest = z.infer<typeof fileMetadataCreateRequestSchema>;

// Create response schema (client-facing)
export const fileMetadataCreateResponseSchema = fileMetadataSchema;
export type FileMetadataCreateResponse = z.infer<typeof fileMetadataCreateResponseSchema>;

// Update request schema - all fields are optional (client-facing)
export const fileMetadataUpdateRequestSchema = fileMetadataBaseSchema.partial();
export type FileMetadataUpdateRequest = z.infer<typeof fileMetadataUpdateRequestSchema>;

// Update response schema (client-facing)
export const fileMetadataUpdateResponseSchema = fileMetadataSchema;
export type FileMetadataUpdateResponse = z.infer<typeof fileMetadataUpdateResponseSchema>;

// Export the base schema for use in other schemas (like hero images)
export const fileMetadataResponseFields = {
    id: z.string().uuid(),
    name: z.string(),
    mimeType: z.string(),
    extension: z.string(),
    url: z.string(),
};
