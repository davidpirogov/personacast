import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { ThemeScript } from "@/components/providers/theme-script";
import { variablesService } from "@/services/variables-service";
import { SITE_SETTINGS_NAME } from "@/app/admin/theming/defaults";

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
    };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head></head>
            <body className={inter.className}>
                <ThemeScript />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
