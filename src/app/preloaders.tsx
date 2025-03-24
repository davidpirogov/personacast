"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PreloadLink } from "./head";

// Preloads all hero images without placing them in the DOM
export function HeroImagesPreloader({ preloadLinks }: { preloadLinks: PreloadLink[] }) {
    useEffect(() => {
        // Manually preload the images since Next.js doesn't export preloadImage
        preloadLinks.forEach((link) => {
            if (link.as === "image") {
                const img = new window.Image();
                img.src = link.href;
            }
        });
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
