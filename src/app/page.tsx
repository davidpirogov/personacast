import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/ui/loading";
import { HeroSection } from "@/components/sections/hero-section";
import { variablesService } from "@/services/variables-service";
import { DEFAULT_SITE_SETTINGS, SITE_SETTINGS_NAME, SiteSettings } from "@/app/admin/theming/defaults";
import { SessionCheck } from "@/components/auth/session-check";
import { generateMetadata as genMeta } from "./head";
import { HeroImagesPreloader } from "./preloaders";
import { HeadResourceHints } from "./head-resource-hints";
import { generatePreloadLinks } from "./head";
import { DynamicHeroImage } from "@/components/layout/dynamic-hero-image";
import { useHeroImage } from "@/providers/hero-images-provider";

// Revalidate every 24 hours (in seconds)
export const revalidate = 86400;

// Cache the settings in memory for faster subsequent renders
let cachedSettings: SiteSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 300000; // 5 minutes in milliseconds

async function getSiteSettings(): Promise<SiteSettings> {
    const now = Date.now();
    if (cachedSettings && now - cacheTimestamp < CACHE_DURATION) {
        return cachedSettings;
    }
    try {
        const site_settings_variable = await variablesService.getByName(SITE_SETTINGS_NAME);

        if (!site_settings_variable) {
            console.warn("Site settings not found, using defaults");
            cachedSettings = DEFAULT_SITE_SETTINGS;
            cacheTimestamp = now;
            return DEFAULT_SITE_SETTINGS;
        }

        const settings = JSON.parse(site_settings_variable.value);
        cachedSettings = settings;
        cacheTimestamp = now;
        return settings;
    } catch (error) {
        console.error("Error loading site settings:", error);
        cachedSettings = DEFAULT_SITE_SETTINGS;
        cacheTimestamp = now;
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

            <main className="min-h-screen bg-background">
                {/* Client component for session check */}
                <Suspense fallback={<Loader />}>
                    <SessionCheck redirectIfOnPage={false} />
                </Suspense>

                {/* Server component with preloaded settings */}
                <HeroSection settings={siteSettings} />
            </main>
        </>
    );
}
