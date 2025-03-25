"use client";

import { createContext, useContext, ReactNode } from "react";
import { SiteSettings } from "@/app/admin/theming/defaults";
import { useRouteHeroImage } from "@/hooks/use-route-hero-image";

type HeroData = {
    fileId: string;
    images: { size: string; width: number; paths: { webp: string; jpeg: string } }[];
    placeholder: string | null;
};

interface HeroImageContextType {
    heroData: HeroData | null;
    isLoading: boolean;
    error: string | null;
}

const HeroImageContext = createContext<HeroImageContextType | null>(null);

interface HeroImageProviderProps {
    children: ReactNode;
    siteSettings: SiteSettings;
}

/**
 * Provider that makes hero image data available throughout the app
 * This provider uses the useRouteHeroImage hook to determine the appropriate
 * hero image based on the current route.
 */
export function HeroImageProvider({ children, siteSettings }: HeroImageProviderProps) {
    const { heroData, isLoading, error } = useRouteHeroImage(siteSettings);

    return (
        <HeroImageContext.Provider value={{ heroData, isLoading, error }}>
            {children}
        </HeroImageContext.Provider>
    );
}

/**
 * Hook to access hero image data from anywhere in the app
 */
export function useHeroImage() {
    const context = useContext(HeroImageContext);
    if (!context) {
        throw new Error("useHeroImage must be used within a HeroImageProvider");
    }
    return context;
}
