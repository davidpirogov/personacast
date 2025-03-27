import { z } from "zod";

// Base episode schema with common fields
const episodeBaseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    podcastId: z.number().int().positive(),
    published: z.boolean().default(false),
    publishedAt: z.date().nullable(),
});

// Schema for a complete episode with all fields
const episodeSchema = episodeBaseSchema.extend({
    id: z.number().int().positive(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// List response schema
export const episodeListResponseSchema = z.array(episodeSchema);
export type EpisodeListResponse = z.infer<typeof episodeListResponseSchema>;

// Get response schema
export const episodeGetResponseSchema = episodeSchema;
export type EpisodeGetResponse = z.infer<typeof episodeGetResponseSchema>;

// Create request schema
export const episodeCreateRequestSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
    description: z.string().min(1, "Description is required"),
    podcastId: z.number().int().positive(),
    published: z.boolean().default(false),
    publishedAt: z.date().nullable().default(null),
});
export type EpisodeCreateRequest = z.infer<typeof episodeCreateRequestSchema>;

// Create response schema
export const episodeCreateResponseSchema = episodeSchema;
export type EpisodeCreateResponse = z.infer<typeof episodeCreateResponseSchema>;

// Update request schema
export const episodeUpdateRequestSchema = episodeBaseSchema.partial();
export type EpisodeUpdateRequest = z.infer<typeof episodeUpdateRequestSchema>;

// Update response schema
export const episodeUpdateResponseSchema = episodeSchema;
export type EpisodeUpdateResponse = z.infer<typeof episodeUpdateResponseSchema>; 