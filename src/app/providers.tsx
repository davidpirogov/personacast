"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from "@/components/ui/nav-bar/nav-bar";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SessionProvider session={null}>
                <NavBar />
                {children}
                <Toaster />
            </SessionProvider>
        </ThemeProvider>
    );
}
