"use client";

import { OptimizedImage } from "@/app/admin/theming/types";

/**
 * Finds the highest quality image from a collection of optimized images
 * Optimized for performance in client-side rendering
 *
 * @param images Array of optimized images with size and path information
 * @param fallbackUrl Optional fallback URL if no optimized images are found
 * @param preferredSize Optional specific size to prioritize (if available)
 * @returns URL of the best quality image, or fallback if none found
 */
export function findBestQualityImage(
    images: OptimizedImage[],
    fallbackUrl?: string | null,
    preferredSize?: string,
): string | null {
    // Early return if no images
    if (!images || images.length === 0) {
        return fallbackUrl || null;
    }

    // If preferred size is specified, try to find that first
    if (preferredSize) {
        const preferred = images.find((img) => img.size === preferredSize);
        if (preferred?.paths?.webp) {
            return preferred.paths.webp;
        }
    }

    // Size preference from largest to smallest
    // Use a map for O(1) lookups instead of array iteration
    const sizeRank: Record<string, number> = {
        "2xl": 6,
        xl: 5,
        lg: 4,
        md: 3,
        sm: 2,
        xs: 1,
        placeholder: 0,
    };

    // Find the image with the highest rank
    // This is more efficient than multiple array iterations
    let bestImage = images[0]; // Default to first image
    let bestRank = sizeRank[bestImage.size] || 0;

    // Single pass through the array
    for (let i = 1; i < images.length; i++) {
        const currentRank = sizeRank[images[i].size] || 0;
        if (currentRank > bestRank) {
            bestImage = images[i];
            bestRank = currentRank;
        }
    }

    return bestImage?.paths?.webp || fallbackUrl || null;
}
