import { z } from "zod";

// Base podcast schema with common fields
const podcastBaseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    published: z.boolean().default(false),
    publishedAt: z.date().nullable(),
});

// Schema for a complete podcast with all fields
const podcastSchema = podcastBaseSchema.extend({
    id: z.number().int().positive(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// List response schema
export const podcastListResponseSchema = z.array(podcastSchema);
export type PodcastListResponse = z.infer<typeof podcastListResponseSchema>;

// Get response schema
export const podcastGetResponseSchema = podcastSchema;
export type PodcastGetResponse = z.infer<typeof podcastGetResponseSchema>;

// Create request schema
export const podcastCreateRequestSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
    description: z.string().min(1, "Description is required"),
    published: z.boolean().default(false),
    publishedAt: z.date().nullable().default(null),
});
export type PodcastCreateRequest = z.infer<typeof podcastCreateRequestSchema>;

// Create response schema
export const podcastCreateResponseSchema = podcastSchema;
export type PodcastCreateResponse = z.infer<typeof podcastCreateResponseSchema>;

// Update request schema
export const podcastUpdateRequestSchema = podcastBaseSchema.partial();
export type PodcastUpdateRequest = z.infer<typeof podcastUpdateRequestSchema>;

// Update response schema
export const podcastUpdateResponseSchema = podcastSchema;
export type PodcastUpdateResponse = z.infer<typeof podcastUpdateResponseSchema>;
