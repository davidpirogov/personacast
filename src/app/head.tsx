import { SiteSettings } from "@/app/admin/theming/defaults";
import { selectBestHeroImage } from "@/lib/shared-image-utils";

// Generate metadata based on site settings
export function generateMetadata(settings: SiteSettings) {
    return {
        title: settings.title || "Personacast",
        description: "Podcasts with AI persona twists",
        openGraph: {
            title: settings.title || "Personacast",
            description: "Podcasts with AI persona twists",
            type: "website",
            images:
                settings.hero.images && settings.hero.images.length > 0
                    ? [{ url: settings.hero.images[0].paths.webp }]
                    : [],
        },
    };
}

// Image preload information
export interface PreloadLink {
    rel: string;
    as: string;
    href: string;
    type: string;
    imageSizes: string;
    fetchPriority: "high" | "auto" | "low";
}

// Generate preload links for critical hero images
export function generatePreloadLinks(settings: SiteSettings): PreloadLink[] {
    if (!settings.hero.images || settings.hero.images.length === 0) {
        return [];
    }

    // Use the shared utility to select the best image
    const mainImageSrc = selectBestHeroImage(settings.hero.images);

    // Only preload the exact image that will be used
    const imagesToPreload = [];

    if (mainImageSrc) {
        imagesToPreload.push({
            rel: "preload",
            as: "image",
            href: mainImageSrc,
            type: "image/webp",
            imageSizes: "100vw",
            fetchPriority: "high" as "high" | "auto" | "low",
        });
    }

    // Always preload the placeholder for instant display
    if (settings.hero.placeholder) {
        imagesToPreload.push({
            rel: "preload",
            as: "image",
            href: settings.hero.placeholder,
            type: "image/webp",
            imageSizes: "100vw",
            fetchPriority: "high" as "high" | "auto" | "low",
        });
    }

    return imagesToPreload;
}

// Custom Head component for preloading resources
export function HeroResourcesHead({ preloadLinks }: { preloadLinks: PreloadLink[] }) {
    return (
        <>
            {preloadLinks.map((link, index) => (
                <link
                    key={index}
                    rel={link.rel}
                    as={link.as}
                    href={link.href}
                    type={link.type}
                    imageSizes={link.imageSizes}
                    fetchPriority={link.fetchPriority}
                />
            ))}
        </>
    );
}
