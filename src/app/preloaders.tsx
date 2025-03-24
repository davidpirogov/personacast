"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PreloadLink } from "./head";

// Simplified preloader for hero images that respects browser's preload mechanism
export function HeroImagesPreloader({ preloadLinks }: { preloadLinks: PreloadLink[] }) {
    useEffect(() => {
        if (!preloadLinks.length) return;

        // Log preloading status for debugging
        if (process.env.NODE_ENV === "development") {
            preloadLinks.forEach((link) => {
                console.debug(`Preloading resource: ${link.href} (priority: ${link.fetchPriority})`);
            });
        }

        // We no longer need to manually preload images here since:
        // 1. Next.js Image handles priority images with priority prop
        // 2. The <link rel="preload"> tags in the head already preload the images
        // 3. Our shared utility ensures the same image is selected on both server and client
    }, [preloadLinks]);

    return null;
}

// Component that preloads another page's data
export function PagePreloader({ href }: { href: string }) {
    const router = useRouter();

    useEffect(() => {
        // Prefetch the route data
        router.prefetch(href);
    }, [router, href]);

    return null;
}
