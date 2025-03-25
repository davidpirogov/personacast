import { NextRequest, NextResponse } from "next/server";
import { podcastService } from "@/services/podcast-service";
import { z } from "zod";

// Schema for validating the slug parameter
const slugParamSchema = z.object({
    slug: z.string().regex(/^[a-zA-Z0-9-]+$/, "Slug must only contain alphanumeric characters and hyphens"),
});

export async function GET(request: NextRequest) {
    try {
        // Get the slug from the query parameters
        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 });
        }

        // Validate the slug format
        try {
            slugParamSchema.parse({ slug });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    {
                        error: "Invalid slug format",
                        details: error.errors[0].message,
                    },
                    { status: 400 },
                );
            }
            throw error;
        }

        // Check if the slug is already in use
        const existingPodcast = await podcastService.getPodcastBySlug(slug);

        return NextResponse.json({
            available: !existingPodcast,
            slug,
        });
    } catch (error) {
        console.error("Error checking slug availability:", error);
        return NextResponse.json({ error: "Failed to check slug availability" }, { status: 500 });
    }
}
