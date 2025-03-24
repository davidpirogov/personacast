"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PreloadLink } from "./head";

// Improved preloader for hero images with priority handling
export function HeroImagesPreloader({ preloadLinks }: { preloadLinks: PreloadLink[] }) {
    useEffect(() => {
        if (!preloadLinks.length) return;

        // Separate high priority from normal priority
        const highPriorityLinks = preloadLinks.filter(link => link.fetchPriority === "high");
        const normalPriorityLinks = preloadLinks.filter(link => link.fetchPriority !== "high");

        // Helper function to preload an image with proper error handling
        const preloadImage = (src: string) => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new window.Image();
                img.onload = () => resolve(img);
                img.onerror = (e) => {
                    console.warn(`Failed to preload image: ${src}`, e);
                    reject(e);
                };
                img.src = src;
            });
        };

        // Immediately load high priority images
        Promise.all(highPriorityLinks.map(link => preloadImage(link.href)))
            .catch(e => console.warn("Error preloading priority images:", e));

        // Load normal priority images after a small delay
        if (normalPriorityLinks.length > 0) {
            const timer = setTimeout(() => {
                normalPriorityLinks.forEach((link, index) => {
                    // Stagger loading to avoid network congestion
                    setTimeout(() => {
                        preloadImage(link.href).catch(() => {});
                    }, index * 100);
                });
            }, 100);

            return () => clearTimeout(timer);
        }
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
