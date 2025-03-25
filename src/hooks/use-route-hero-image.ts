"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteSettings } from "@/app/admin/theming/defaults";

type HeroData = {
    fileId: string;
    images: { size: string; width: number; paths: { webp: string; jpeg: string } }[];
    placeholder: string | null;
};

interface UseRouteHeroImageReturn {
    heroData: HeroData | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook that fetches the appropriate hero image data based on the current route
 * This is a client-side hook that makes API calls to fetch hero data
 *
 * @param siteSettings The site settings object containing the default hero image
 * @returns An object containing the heroData, loading state, and error
 */
export function useRouteHeroImage(siteSettings: SiteSettings): UseRouteHeroImageReturn {
    const pathname = usePathname();
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHeroData() {
            setIsLoading(true);
            setError(null);

            try {
                // Parse the path to determine what we're looking at
                const pathParts = pathname.split("/").filter(Boolean);

                // Default to site settings hero
                let fetchedHeroData: HeroData | null = null;

                // If we're on a podcast or episode page, fetch the appropriate hero
                if (pathParts[0] === "podcasts" && pathParts.length > 1) {
                    const podcastSlug = pathParts[1];

                    // Check if we're on an episode page
                    if (pathParts[2] === "episodes" && pathParts.length > 3) {
                        const episodeSlug = pathParts[3];
                        // Fetch episode hero if available
                        const episodeResponse = await fetch(
                            `/api/podcasts/${podcastSlug}/episodes/${episodeSlug}/hero`,
                        );

                        if (episodeResponse.ok) {
                            const episodeData = await episodeResponse.json();
                            if (episodeData.success && episodeData.data) {
                                fetchedHeroData = episodeData.data.hero;
                            }
                        }
                    }

                    // If no episode hero or not on episode page, try podcast hero
                    if (!fetchedHeroData) {
                        const podcastResponse = await fetch(`/api/podcasts/${podcastSlug}/hero`);

                        if (podcastResponse.ok) {
                            const podcastData = await podcastResponse.json();
                            if (podcastData.success && podcastData.data) {
                                fetchedHeroData = podcastData.data.hero;
                            }
                        }
                    }
                }

                // If we couldn't find a specific hero, use the site settings hero
                // Ensure fileId is not null, using a fallback if needed
                if (!fetchedHeroData && siteSettings.hero.fileId) {
                    fetchedHeroData = {
                        fileId: siteSettings.hero.fileId,
                        images: siteSettings.hero.images,
                        placeholder: siteSettings.hero.placeholder,
                    };
                } else if (!fetchedHeroData) {
                    // Use a default fileId if none is available
                    fetchedHeroData = {
                        fileId: "default-hero",
                        images: siteSettings.hero.images,
                        placeholder: siteSettings.hero.placeholder,
                    };
                }

                setHeroData(fetchedHeroData);
            } catch (err) {
                console.error("Error fetching hero data:", err);
                setError("Failed to load hero image");

                // Fall back to site settings hero, ensuring fileId is not null
                if (siteSettings.hero.fileId) {
                    setHeroData({
                        fileId: siteSettings.hero.fileId,
                        images: siteSettings.hero.images,
                        placeholder: siteSettings.hero.placeholder,
                    });
                } else {
                    setHeroData({
                        fileId: "default-hero",
                        images: siteSettings.hero.images,
                        placeholder: siteSettings.hero.placeholder,
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchHeroData();
    }, [pathname, siteSettings]);

    return { heroData, isLoading, error };
}
