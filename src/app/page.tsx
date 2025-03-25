import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/ui/loading";
import { HeroSection } from "@/components/sections/hero-section";
import { DEFAULT_SITE_SETTINGS, SiteSettings } from "@/app/admin/theming/defaults";
import { SessionCheck } from "@/components/auth/session-check";
import { generateMetadata as genMeta } from "./head";
import { HeroImagesPreloader } from "./preloaders";
import { HeadResourceHints } from "./head-resource-hints";
import { generatePreloadLinks } from "./head";
import { variablesService } from "@/services/variables-service";

// Revalidate every 24 hours (in seconds)
export const revalidate = 86400;

async function getSiteSettings(): Promise<SiteSettings> {
    try {
        // Use direct service call on server
        const settings = await variablesService.getByName("system.site_settings");

        if (!settings) {
            console.warn("Failed to fetch site settings, using defaults");
            return DEFAULT_SITE_SETTINGS;
        }

        return JSON.parse(settings.value);
    } catch (error) {
        console.error("Error loading site settings:", error);
        return DEFAULT_SITE_SETTINGS;
    }
}

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return genMeta(settings);
}

export default async function LandingPage() {
    // Fetch site settings at build/revalidation time - cached by ISR
    const siteSettings = await getSiteSettings();

    // Use the server-safe generatePreloadLinks function instead
    const preloadLinks = generatePreloadLinks(siteSettings);

    return (
        <>
            {/* Add resource hints to improve loading performance */}
            <HeadResourceHints settings={siteSettings} />
            {/* Preload hero images using the Next.js Image API */}
            <Suspense>
                <HeroImagesPreloader preloadLinks={preloadLinks} />
            </Suspense>

            <div className="min-h-screen bg-background">
                {/* Client component for session check */}
                <Suspense fallback={<Loader />}>
                    <SessionCheck redirectIfOnPage={false} />
                </Suspense>

                {/* Server component with preloaded settings */}
                <HeroSection settings={siteSettings} />
            </div>
        </>
    );
}
