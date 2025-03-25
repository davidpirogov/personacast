import { NextRequest, NextResponse } from "next/server";
import { podcastService } from "@/services/podcast-service";
import { heroImagesService } from "@/services/hero-images-service";

/**
 * GET /api/podcasts/[slug]/hero
 * Returns hero image data for a specific podcast by slug
 */
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const awaitedParams = await params;
        const { slug } = awaitedParams;

        // Get the podcast by slug
        const podcast = await podcastService.getPodcastBySlug(slug);
        if (!podcast) {
            return NextResponse.json({ success: false, message: "Podcast not found" }, { status: 404 });
        }

        // Check for heroImageId
        if (!podcast.heroImageId) {
            return NextResponse.json(
                { success: false, message: "Podcast has no hero image" },
                { status: 404 },
            );
        }

        // Get the hero image
        const heroImage = await heroImagesService.get(podcast.heroImageId);
        if (!heroImage) {
            return NextResponse.json({ success: false, message: "Hero image not found" }, { status: 404 });
        }

        // Get optimized image URLs
        const optimizedImageUrls = await heroImagesService.getOptimizedImageUrls(heroImage.fileId);
        if (!optimizedImageUrls) {
            return NextResponse.json(
                { success: false, message: "Failed to get optimized image URLs" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: heroImage.id,
                name: heroImage.name,
                description: heroImage.description,
                fileId: heroImage.fileId,
                hero: {
                    fileId: heroImage.fileId,
                    images: optimizedImageUrls.images,
                    placeholder: optimizedImageUrls.placeholder,
                },
            },
        });
    } catch (error) {
        console.error("Error in podcast hero API:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
