import { HeroImage } from "@/lib/database/types/models.d";
import { IdCRUDService } from "@/lib/services/base/services.d";

export interface HeroImageService extends IdCRUDService<HeroImage> {
    /**
     * Get a hero image by file ID
     */
    getByFileId(fileId: string): Promise<HeroImage | null>;

    /**
     * Get a hero image by podcast ID
     */
    getByPodcastId(podcastId: number): Promise<HeroImage | null>;

    /**
     * Get a hero image by episode ID
     */
    getByEpisodeId(episodeId: number): Promise<HeroImage | null>;

    /**
     * Get optimized image URLs for a hero image
     */
    getOptimizedImageUrls(fileId: string): Promise<OptimizedHeroImage | null>;

    /**
     * Get the relative URLs for a hero image
     */
    getHeroImageUrls(
        fileId: string,
        size: string,
    ): { baseFilename: string; webpUrl: string; jpegUrl: string };
}

export interface OptimizedHeroImage {
    success: boolean;
    images: { size: string; width: number; paths: { webp: string; jpeg: string } }[];
    placeholder: string;
}
