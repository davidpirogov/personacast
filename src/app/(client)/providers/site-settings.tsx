"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { SiteSettings, DEFAULT_SITE_SETTINGS } from "@/app/admin/theming/defaults";

interface SiteSettingsContextType {
    settings: SiteSettings;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
    settings: DEFAULT_SITE_SETTINGS,
    isLoading: true,
    error: null,
    refetch: async () => {},
});

// Hook to use site settings in components
export const useSiteSettings = () => useContext(SiteSettingsContext);

interface SiteSettingsProviderProps {
    children: ReactNode;
}

export function SiteSettingsProvider({ children }: SiteSettingsProviderProps) {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("/api/site-settings", {
                next: {
                    revalidate: 300, // Cache for 5 minutes
                    tags: ["site-settings"],
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch site settings");
            }

            const data = await response.json();
            setSettings(data);
        } catch (err) {
            console.error("Failed to load site settings:", err);
            setError(err instanceof Error ? err : new Error("Failed to load site settings"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider
            value={{
                settings,
                isLoading,
                error,
                refetch: fetchSettings,
            }}
        >
            {children}
        </SiteSettingsContext.Provider>
    );
}
