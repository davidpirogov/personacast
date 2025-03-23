import { podcastCreateRequestSchema, podcastListResponseSchema } from "@/schemas/podcasts/schema";
import { podcastService } from "@/services/podcast-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const podcasts = await podcastService.list();

        const validatedPodcasts = podcastListResponseSchema.parse(podcasts);

        return NextResponse.json(validatedPodcasts);
    } catch (error) {
        console.error("System error getting a list of podcasts:", error);
        return NextResponse.json({ error: "Failed to get podcasts" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Received POST request with body:", body);

        const validatedBody = podcastCreateRequestSchema.parse(body);
        console.log("Validated body:", validatedBody);

        const podcast = await podcastService.create(validatedBody);
        return NextResponse.json(podcast);
    } catch (error) {
        console.error("System error creating a podcast:", error);
        return NextResponse.json({ error: "Failed to create podcast" }, { status: 500 });
    }
}
