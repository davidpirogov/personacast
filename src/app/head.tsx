import { SiteSettings } from "@/app/admin/theming/defaults";

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

    // Find the most appropriate sizes for preloading
    const imagesToPreload = settings.hero.images
        .filter((img) => ["md", "lg"].includes(img.size))
        .map((img) => ({
            rel: "preload",
            as: "image",
            href: img.paths.webp,
            type: "image/webp",
            imageSizes: "100vw",
            fetchPriority: (img.size === "lg" ? "high" : "auto") as "high" | "auto" | "low",
        }));

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
