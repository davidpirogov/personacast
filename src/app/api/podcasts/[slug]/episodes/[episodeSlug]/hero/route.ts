import { NextRequest, NextResponse } from "next/server";
import { episodeService } from "@/services/episode-service";
import { heroImagesService } from "@/services/hero-images-service";

/**
 * GET /api/podcasts/[slug]/episodes/[episodeSlug]/hero
 * Returns hero image data for a specific episode by podcast slug and episode slug
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string; episodeSlug: string } },
) {
    try {
        const awaitedParams = await params;
        const { slug, episodeSlug } = awaitedParams;

        // Get the episode
        const episode = await episodeService.getEpisodeByPodcastSlugAndEpisodeSlug(slug, episodeSlug);
        if (!episode) {
            return NextResponse.json({ success: false, message: "Episode not found" }, { status: 404 });
        }

        // Check for heroImageId
        if (!episode.heroImageId) {
            return NextResponse.json(
                { success: false, message: "Episode has no hero image" },
                { status: 404 },
            );
        }

        // Get the hero image
        const heroImage = await heroImagesService.get(episode.heroImageId);
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
        console.error("Error in episode hero API:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
