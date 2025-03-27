export interface HeroReferenceService {
    /**
     * Checks if a file is referenced as the site settings hero image
     */
    isFileReferencedInSiteSettings(fileId: string): Promise<boolean>;

    /**
     * Checks if a hero image is referenced in site settings
     */
    isHeroImageReferencedInSiteSettings(heroImageId: number): Promise<boolean>;

    /**
     * Resets the site settings hero image to the default
     */
    resetSiteSettingsHeroImage(): Promise<void>;

    /**
     * Finds podcasts that reference a specific hero image
     */
    findPodcastsWithHeroImage(heroImageId: number): Promise<number[]>;

    /**
     * Finds episodes that reference a specific hero image
     */
    findEpisodesWithHeroImage(heroImageId: number): Promise<number[]>;

    /**
     * Resets the hero image reference in a podcast
     */
    resetPodcastHeroImage(podcastId: number): Promise<void>;

    /**
     * Resets the hero image reference in an episode
     */
    resetEpisodeHeroImage(episodeId: number): Promise<void>;

    /**
     * Checks all entity references for a file and resets them if needed
     */
    handleFileDelete(fileId: string): Promise<void>;

    /**
     * Handles the deletion of a hero image by checking for references
     */
    handleHeroImageDelete(heroImageId: number): Promise<void>;
}
