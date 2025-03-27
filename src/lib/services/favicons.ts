import { SiteSettings, SITE_SETTINGS_NAME } from "@/app/admin/theming/defaults";
import { variablesService } from "@/lib/services/variables";
import { FaviconService } from "@/lib/services/favicons.d";
import fs from "fs/promises";
import path from "path";

/**
 * Service to manage favicons and manifest.json
 * This allows the admin to customize these settings
 */
class FaviconServiceImpl implements FaviconService {
    private manifestPath: string;

    constructor() {
        // Path is relative to the project root in production
        this.manifestPath = path.join(process.cwd(), "public", "manifest.json");
    }

    /**
     * Updates the manifest.json file based on site settings
     * @param settings The site settings object
     */
    async updateManifest(settings: SiteSettings): Promise<void> {
        try {
            // Read the current manifest
            const manifestData = await fs.readFile(this.manifestPath, "utf-8");
            const manifest = JSON.parse(manifestData);

            // Update manifest with site settings
            manifest.name = settings.title || "Personacast";
            manifest.short_name = settings.title || "Personacast";

            // Use the primary color from settings for theme color
            manifest.theme_color = settings.colors?.primary?.hex || "#ffffff";

            // Use the secondary color from settings for background
            manifest.background_color = settings.colors?.secondary?.hex || "#ffffff";

            // If there's a hero image, use it for the manifest icons
            if (settings.hero.images && settings.hero.images.length > 0) {
                // For now, we'll keep the default icons
                // In a real implementation, you might generate icons from the hero image
            }

            // Write the updated manifest
            await fs.writeFile(this.manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
        } catch (error) {
            console.error("Error updating manifest:", error);
        }
    }

    /**
     * Syncs the favicon and manifest with the current site settings
     */
    async syncWithSiteSettings(): Promise<void> {
        try {
            const siteSettingsVar = await variablesService.getByName(SITE_SETTINGS_NAME);
            if (!siteSettingsVar) return;

            const settings: SiteSettings = JSON.parse(siteSettingsVar.value);
            await this.updateManifest(settings);
        } catch (error) {
            console.error("Error syncing favicon with site settings:", error);
        }
    }
}

// Export a singleton instance
export const faviconService = new FaviconServiceImpl();

// Export the interface for better type inference
export type { FaviconService };
