import { OptimizedImage } from "@/app/admin/theming/types";

/**
 * Environment-agnostic image selection logic that works in both server and client contexts
 * Selects the best hero image based on viewport and device information
 *
 * @param images Array of optimized images with size and path information
 * @param viewportInfo Optional viewport/device info, only available in client context
 * @returns URL of the best quality image, or null if none found
 */
export function selectBestHeroImage(
    images: OptimizedImage[],
    viewportInfo?: { width: number; dpr: number } | null,
): string | null {
    // Early return if no images
    if (!images || images.length === 0) return null;

    // Default to larger sizes when no viewport info (server context)
    if (!viewportInfo) {
        // Server-side selection logic - prioritize 2xl or xl
        const xlImage =
            images.find((img) => img.size === "2xl") ||
            images.find((img) => img.size === "xl") ||
            images.find((img) => img.size === "lg");

        return xlImage?.paths.webp || images[0].paths.webp;
    }

    // Client-side with viewport info
    const { width, dpr } = viewportInfo;
    const effectiveWidth = width * dpr;

    // Map sizes to approximate width ranges
    const sizeMap: Record<string, number> = {
        "2xl": 1920,
        xl: 1440,
        lg: 1024,
        md: 768,
        sm: 640,
        xs: 480,
    };

    // Find appropriate size based on viewport
    let selectedSize = "xs";
    for (const [size, minWidth] of Object.entries(sizeMap)) {
        if (effectiveWidth >= minWidth) {
            selectedSize = size;
            break;
        }
    }

    // Find the image with that size or fall back to nearest size
    const exactMatch = images.find((img) => img.size === selectedSize);
    if (exactMatch) return exactMatch.paths.webp;

    // Fall back to next size up or down
    const sizes = Object.keys(sizeMap);
    const currentIndex = sizes.indexOf(selectedSize);

    // Try larger sizes first, then smaller sizes
    for (let i = currentIndex - 1; i >= 0; i--) {
        const img = images.find((img) => img.size === sizes[i]);
        if (img) return img.paths.webp;
    }

    for (let i = currentIndex + 1; i < sizes.length; i++) {
        const img = images.find((img) => img.size === sizes[i]);
        if (img) return img.paths.webp;
    }

    // Last resort fallback
    return images[0].paths.webp;
}
