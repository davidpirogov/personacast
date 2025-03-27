import { DEFAULT_SITE_SETTINGS, SITE_SETTINGS_NAME, SiteSettings } from "@/app/admin/theming/defaults";
import { heroImageService } from "./hero-images";
import { variablesService } from "./variables";
import { podcastService } from "./podcasts";
import { episodeService } from "./episodes";
import { faviconService } from "./favicons";
import { HeroReferenceService } from "./hero-references.d";

/**
 * Service to manage hero image references across entities
 * This service is responsible for:
 * 1. Checking if a file is referenced as a hero image in site settings or other entities
 * 2. Resetting hero image settings when a referenced file is deleted
 */
class HeroReferenceServiceImpl implements HeroReferenceService {
    /**
     * Checks if a file is referenced as the site settings hero image
     * @param fileId The ID of the file to check
     * @returns A boolean indicating if the file is referenced
     */
    async isFileReferencedInSiteSettings(fileId: string): Promise<boolean> {
        const siteSettingsVar = await variablesService.getByName(SITE_SETTINGS_NAME);
        if (!siteSettingsVar) return false;

        const siteSettings: SiteSettings = JSON.parse(siteSettingsVar.value);
        return siteSettings.hero.fileId === fileId;
    }

    /**
     * Checks if a hero image is referenced in site settings
     * @param heroImageId The ID of the hero image to check
     * @returns A boolean indicating if the hero image is referenced
     */
    async isHeroImageReferencedInSiteSettings(heroImageId: number): Promise<boolean> {
        const heroImage = await heroImageService.get(heroImageId);
        if (!heroImage) return false;

        return this.isFileReferencedInSiteSettings(heroImage.fileId);
    }

    /**
     * Resets the site settings hero image to the default
     * @returns A promise that resolves when the operation completes
     */
    async resetSiteSettingsHeroImage(): Promise<void> {
        const siteSettingsVar = await variablesService.getByName(SITE_SETTINGS_NAME);
        if (!siteSettingsVar) return;

        const siteSettings: SiteSettings = JSON.parse(siteSettingsVar.value);

        // Reset to default hero image
        const updatedSettings: SiteSettings = {
            ...siteSettings,
            hero: DEFAULT_SITE_SETTINGS.hero,
        };

        // Save updated settings
        await variablesService.update(siteSettingsVar.id, {
            value: JSON.stringify(updatedSettings),
        });

        // Sync favicon and manifest with updated settings
        await faviconService.syncWithSiteSettings();
    }

    /**
     * Finds podcasts that reference a specific hero image
     * @param heroImageId The ID of the hero image to check
     * @returns Array of podcast IDs that reference the hero image
     */
    async findPodcastsWithHeroImage(heroImageId: number): Promise<number[]> {
        const podcasts = await podcastService.list();
        return podcasts.filter((podcast) => podcast.heroImageId === heroImageId).map((podcast) => podcast.id);
    }

    /**
     * Finds episodes that reference a specific hero image
     * @param heroImageId The ID of the hero image to check
     * @returns Array of episode IDs that reference the hero image
     */
    async findEpisodesWithHeroImage(heroImageId: number): Promise<number[]> {
        const episodes = await episodeService.list();
        return episodes.filter((episode) => episode.heroImageId === heroImageId).map((episode) => episode.id);
    }

    /**
     * Resets the hero image reference in a podcast
     * @param podcastId The ID of the podcast to update
     */
    async resetPodcastHeroImage(podcastId: number): Promise<void> {
        await podcastService.update(podcastId, { heroImageId: null });
    }

    /**
     * Resets the hero image reference in an episode
     * @param episodeId The ID of the episode to update
     */
    async resetEpisodeHeroImage(episodeId: number): Promise<void> {
        await episodeService.update(episodeId, { heroImageId: null });
    }

    /**
     * Checks all entity references for a file and resets them if needed
     * This handles both direct file references and hero image references
     * @param fileId The ID of the file being deleted
     * @returns A promise that resolves when all references are checked and reset
     */
    async handleFileDelete(fileId: string): Promise<void> {
        // Check if the file is referenced in site settings
        const isReferencedInSiteSettings = await this.isFileReferencedInSiteSettings(fileId);
        if (isReferencedInSiteSettings) {
            await this.resetSiteSettingsHeroImage();
        }

        // Check if the file is used in a hero image
        const heroImage = await heroImageService.getByFileId(fileId);
        if (heroImage) {
            // Find referencing podcasts and reset them
            const podcastIds = await this.findPodcastsWithHeroImage(heroImage.id);
            for (const podcastId of podcastIds) {
                await this.resetPodcastHeroImage(podcastId);
            }

            // Find referencing episodes and reset them
            const episodeIds = await this.findEpisodesWithHeroImage(heroImage.id);
            for (const episodeId of episodeIds) {
                await this.resetEpisodeHeroImage(episodeId);
            }
        }
    }

    /**
     * Handles the deletion of a hero image by checking for references
     * @param heroImageId The ID of the hero image being deleted
     * @returns A promise that resolves when all references are checked and reset
     */
    async handleHeroImageDelete(heroImageId: number): Promise<void> {
        // Check if the hero image is referenced in site settings
        const isReferencedInSiteSettings = await this.isHeroImageReferencedInSiteSettings(heroImageId);
        if (isReferencedInSiteSettings) {
            await this.resetSiteSettingsHeroImage();
        }

        // Find referencing podcasts and reset them
        const podcastIds = await this.findPodcastsWithHeroImage(heroImageId);
        for (const podcastId of podcastIds) {
            await this.resetPodcastHeroImage(podcastId);
        }

        // Find referencing episodes and reset them
        const episodeIds = await this.findEpisodesWithHeroImage(heroImageId);
        for (const episodeId of episodeIds) {
            await this.resetEpisodeHeroImage(episodeId);
        }
    }
}

// Export a singleton instance
export const heroReferenceService = new HeroReferenceServiceImpl();

// Export the interface for better type inference
export type { HeroReferenceService };
