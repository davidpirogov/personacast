import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { ThemeScript } from "@/components/providers/theme-script";
import { Footer } from "@/components/ui/footer/footer";
import { variablesService } from "@/services/variables-service";
import { SITE_SETTINGS_NAME, DEFAULT_SITE_SETTINGS } from "@/app/admin/theming/defaults";
import { HeroImageProvider } from "@/providers/hero-images-provider";

const inter = Inter({ subsets: ["latin"] });

// Generate dynamic metadata based on site settings
export async function generateMetadata(): Promise<Metadata> {
    // Get site settings
    let siteTitle = "Personacast"; // Default fallback
    let siteDescription = "Podcasts with AI persona twists";

    try {
        const site_settings_variable = await variablesService.getByName(SITE_SETTINGS_NAME);
        if (site_settings_variable) {
            const settings = JSON.parse(site_settings_variable.value);
            siteTitle = settings.title || siteTitle;
        }
    } catch (error) {
        console.error("Error loading site settings for metadata:", error);
    }

    return {
        title: {
            template: `%s | ${siteTitle}`,
            default: siteTitle,
        },
        description: siteDescription,
        icons: {
            icon: [
                { url: "/favicons/favicon.ico" },
                { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
                { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            ],
            apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
            other: [{ rel: "mask-icon", url: "/favicons/safari-pinned-tab.svg", color: "#5bbad5" }],
        },
        manifest: "/manifest.json",
        appleWebApp: {
            title: siteTitle,
            statusBarStyle: "default",
            capable: true,
        },
    };
}

// Add viewport export for theme color
export async function generateViewport(): Promise<Viewport> {
    // Try to get site settings for theme color
    let themeColor = "#ffffff"; // Default fallback

    try {
        const site_settings_variable = await variablesService.getByName(SITE_SETTINGS_NAME);
        if (site_settings_variable) {
            const settings = JSON.parse(site_settings_variable.value);
            themeColor = settings.colors?.primary?.hex || themeColor;
        }
    } catch (error) {
        console.error("Error loading site settings for viewport:", error);
    }

    return {
        themeColor: themeColor,
    };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Get site settings for hero image provider
    let siteSettings = DEFAULT_SITE_SETTINGS;

    try {
        const site_settings_variable = await variablesService.getByName(SITE_SETTINGS_NAME);
        if (site_settings_variable) {
            siteSettings = JSON.parse(site_settings_variable.value);
        }
    } catch (error) {
        console.error("Error loading site settings for layout:", error);
    }

    return (
        <html lang="en">
            <head></head>
            <body className={inter.className}>
                <ThemeScript />
                <Providers>
                    <HeroImageProvider siteSettings={siteSettings}>
                        {children}
                        <Footer />
                    </HeroImageProvider>
                </Providers>
            </body>
        </html>
    );
}
