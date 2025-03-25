"use client";

import { signIn } from "next-auth/react";
import { useSiteSettings } from "@/app/providers";
import { useSessionState } from "@/lib/hooks/use-session-state";
import { LatestEpisodes } from "./latest-episodes";
import { QuickLinks } from "./quick-links";

export function Footer() {
    const siteSettings = useSiteSettings();
    const { session } = useSessionState();

    const currentYear = new Date().getFullYear();

    return (
        <footer className="backdrop-blur-lg border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-foreground">{siteSettings.title}</h3>
                        <p className="text-muted-foreground mb-4">{siteSettings.description}</p>
                    </div>

                    <div>
                        <LatestEpisodes />
                    </div>

                    <div>
                        <QuickLinks />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} {siteSettings.title}. All rights reserved.
                    </p>

                    {!session && (
                        <button
                            onClick={() => signIn()}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 md:mt-0"
                        >
                            Admin & Editor Login
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
}
