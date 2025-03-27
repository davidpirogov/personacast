import { SiteSettings } from "@/app/admin/theming/defaults";

export interface FaviconService {
    /**
     * Updates the manifest.json file based on site settings
     */
    updateManifest(settings: SiteSettings): Promise<void>;

    /**
     * Syncs the favicon and manifest with the current site settings
     */
    syncWithSiteSettings(): Promise<void>;
} 