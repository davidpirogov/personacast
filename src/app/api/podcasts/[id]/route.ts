import { NextRequest, NextResponse } from "next/server";
import { podcastService } from "@/services/podcast-service";
import { podcastGetResponseSchema } from "@/schemas/podcasts/schema";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid podcast ID" }, { status: 400 });
        }

        const podcast = await podcastService.get(id);

        if (!podcast) {
            return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
        }

        const validatedPodcast = podcastGetResponseSchema.parse(podcast);

        return NextResponse.json(validatedPodcast);
    } catch (error) {
        console.error("System error fetching podcast:", error);
        return NextResponse.json({ error: "Failed to fetch podcast" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid podcast ID" }, { status: 400 });
        }

        const podcast = await podcastService.get(id);

        if (!podcast) {
            return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
        }

        await podcastService.delete(id);

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("System error deleting podcast:", error);
        return NextResponse.json({ error: "Failed to delete podcast" }, { status: 500 });
    }
}
