import { NextRequest, NextResponse } from "next/server";
import { heroImagesService } from "@/services/hero-images-service";
import { DEFAULT_SITE_SETTINGS, SITE_SETTINGS_NAME } from "@/app/admin/theming/defaults";
import { variablesService } from "@/services/variables-service";
import { z } from "zod";

const querySchema = z.object({
    type: z.enum(["podcast", "episode", "default"]),
    id: z.string().optional(),
});

/**
 * GET /api/hero-images
 * Returns hero image data for a specific entity (podcast, episode) or the default
 *
 * Query params:
 * - type: "podcast" | "episode" | "default"
 * - id: The entity ID (required for podcast, episode)
 */
export async function GET(request: NextRequest) {
    try {
        // Parse the URL and extract query params
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const id = searchParams.get("id");

        // Validate params
        const result = querySchema.safeParse({ type, id });
        if (!result.success) {
            return NextResponse.json(
                { success: false, message: "Invalid parameters", errors: result.error.errors },
                { status: 400 },
            );
        }

        const params = result.data;

        let heroImage = null;

        // Get hero image data based on type
        switch (params.type) {
            case "podcast":
                if (!params.id) {
                    return NextResponse.json(
                        { success: false, message: "Podcast ID is required" },
                        { status: 400 },
                    );
                }
                heroImage = await heroImagesService.getByPodcastId(parseInt(params.id));
                break;

            case "episode":
                if (!params.id) {
                    return NextResponse.json(
                        { success: false, message: "Episode ID is required" },
                        { status: 400 },
                    );
                }
                heroImage = await heroImagesService.getByEpisodeId(parseInt(params.id));
                break;

            case "default":
                // Get default hero from site settings
                const siteSettingsVar = await variablesService.getByName(SITE_SETTINGS_NAME);
                if (siteSettingsVar) {
                    const siteSettings = JSON.parse(siteSettingsVar.value);
                    return NextResponse.json({
                        success: true,
                        data: {
                            hero: siteSettings.hero,
                        },
                    });
                } else {
                    // Return the hardcoded default
                    return NextResponse.json({
                        success: true,
                        data: {
                            hero: DEFAULT_SITE_SETTINGS.hero,
                        },
                    });
                }
        }

        if (!heroImage) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Hero image not found",
                },
                { status: 404 },
            );
        }

        // Get optimized image URLs
        const optimizedImageUrls = await heroImagesService.getOptimizedImageUrls(heroImage.fileId);

        if (!optimizedImageUrls) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to get optimized image URLs",
                },
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
        console.error("Error in hero images API:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
