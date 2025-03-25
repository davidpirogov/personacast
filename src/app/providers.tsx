"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { MenuProvider } from "@/components/providers/menu/menu-provider";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from "@/components/ui/nav-bar/nav-bar";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { SiteSettings, DEFAULT_SITE_SETTINGS } from "@/app/admin/theming/defaults";

// Create a context for site settings
const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

// Hook to use site settings in components
export const useSiteSettings = () => useContext(SiteSettingsContext);

// Site settings provider component
function SiteSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

    useEffect(() => {
        async function loadSettings() {
            try {
                const response = await fetch("/api/variables/by-name/system.site_settings");
                if (response.ok) {
                    const data = await response.json();
                    setSettings(JSON.parse(data.value));
                }
            } catch (error) {
                console.error("Failed to load site settings:", error);
            }
        }

        loadSettings();
    }, []);

    return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SessionProvider>
                <SiteSettingsProvider>
                    <MenuProvider>
                        <NavBar />
                        {children}
                        <Toaster />
                    </MenuProvider>
                </SiteSettingsProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}
