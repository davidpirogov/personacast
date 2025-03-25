"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { MenuProvider } from "./menu";
import { SiteSettingsProvider } from "./site-settings";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from "@/components/ui/nav-bar/nav-bar";

interface RootProviderProps {
    children: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
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
