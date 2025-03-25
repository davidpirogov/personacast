"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteSettings } from "@/app/admin/theming/defaults";
import { findBestQualityImage } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

interface DynamicHeroImageProps {
    podcastHero?: {
        fileId: string;
        images: { size: string; width: number; paths: { webp: string; jpeg: string } }[];
        placeholder: string | null;
    } | null;
    episodeHero?: {
        fileId: string;
        images: { size: string; width: number; paths: { webp: string; jpeg: string } }[];
        placeholder: string | null;
    } | null;
    className?: string;
    siteSettings: SiteSettings;
    priority?: boolean;
}

/**
 * Component that dynamically selects the appropriate hero image based on the current route
 *
 * Resolution order:
 * 1. Episode hero image (if on episode route and available)
 * 2. Podcast hero image (if on podcast route and available)
 * 3. Site settings hero image (fallback)
 */
export function DynamicHeroImage({
    podcastHero,
    episodeHero,
    className,
    siteSettings,
    priority = false,
}: DynamicHeroImageProps) {
    const pathname = usePathname();
    const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
    const [placeholder, setPlaceholder] = useState<string | null>(null);

    useEffect(() => {
        // Determine which hero image to use based on the route
        if (pathname.includes("/podcasts/") && pathname.includes("/episodes/") && episodeHero) {
            // We're on an episode page and have an episode hero
            setHeroImageUrl(findBestQualityImage(episodeHero.images, episodeHero.placeholder));
            setPlaceholder(episodeHero.placeholder);
        } else if (pathname.includes("/podcasts/") && podcastHero) {
            // We're on a podcast page and have a podcast hero
            setHeroImageUrl(findBestQualityImage(podcastHero.images, podcastHero.placeholder));
            setPlaceholder(podcastHero.placeholder);
        } else {
            // Fallback to the site settings hero
            setHeroImageUrl(findBestQualityImage(siteSettings.hero.images, siteSettings.hero.placeholder));
            setPlaceholder(siteSettings.hero.placeholder);
        }
    }, [pathname, podcastHero, episodeHero, siteSettings]);

    if (!heroImageUrl) {
        return null;
    }

    return (
        <div className={cn("relative w-full h-screen", className)}>
            <Image
                src={heroImageUrl}
                alt="Hero"
                fill
                priority={priority}
                quality={90}
                placeholder={placeholder ? "blur" : "empty"}
                blurDataURL={placeholder || undefined}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    );
}
