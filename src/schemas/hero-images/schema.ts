import { z } from "zod";
import { fileMetadataResponseFields } from "../files/schema";

// Base hero image schema with common fields
const heroImageBaseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    fileId: z.string().min(1, "File ID is required"),
    podcastId: z.number().int().positive().nullable().optional(),
    episodeId: z.number().int().positive().nullable().optional(),
    urlTo: z.string().nullable().optional(),
});

// Schema for a complete hero image with all fields
const heroImageSchema = heroImageBaseSchema.extend({
    id: z.number().int().positive(),
    createdAt: z.date(),
    updatedAt: z.date(),
    file: z.object(fileMetadataResponseFields),
    podcast: z
        .object({
            id: z.number().int().positive(),
            title: z.string(),
            description: z.string(),
        })
        .optional(),
    episode: z
        .object({
            id: z.number().int().positive(),
            title: z.string(),
            description: z.string(),
        })
        .optional(),
});

// List response schema
export const heroImageListResponseSchema = z.array(heroImageSchema);
export type HeroImageListResponse = z.infer<typeof heroImageListResponseSchema>;

// Get response schema
export const heroImageGetResponseSchema = heroImageSchema;
export type HeroImageGetResponse = z.infer<typeof heroImageGetResponseSchema>;

// Create request schema - we need fileId for creation
export const heroImageCreateRequestSchema = heroImageBaseSchema;
export type HeroImageCreateRequest = z.infer<typeof heroImageCreateRequestSchema>;

// Create response schema
export const heroImageCreateResponseSchema = heroImageSchema;
export type HeroImageCreateResponse = z.infer<typeof heroImageCreateResponseSchema>;

// Update request schema
export const heroImageUpdateRequestSchema = heroImageBaseSchema.partial();
export type HeroImageUpdateRequest = z.infer<typeof heroImageUpdateRequestSchema>;

// Update response schema
export const heroImageUpdateResponseSchema = heroImageSchema;
export type HeroImageUpdateResponse = z.infer<typeof heroImageUpdateResponseSchema>;
