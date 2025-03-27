import { HeroImage } from "@/lib/database/types/models.d";
import HeroImagesAdapter from "@/lib/database/adapters/hero-images";
import { HeroImageService, OptimizedHeroImage } from "./hero-images.d";
import { filesService } from "./files";
import { heroReferenceService } from "./hero-references";
import { IdService } from "./base";
import { basename, join } from "path";
import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";

// Define image sizes for different viewports
const IMAGE_SIZES = {
    xs: 320,
    sm: 640,
    md: 1080,
    lg: 1920,
    xl: 2560,
    "2xl": 3840,
} as const;

/**
 * Implementation of HeroImageService using the base service pattern
 */
class HeroImageServiceImpl extends IdService<HeroImage> implements HeroImageService {
    private appDataDir: string;

    constructor() {
        super(new HeroImagesAdapter());

        if (!process.env.APP_DATA) {
            throw new Error("APP_DATA is not set");
        }

        this.appDataDir = process.env.APP_DATA;
    }

    /**
     * Override create to handle image processing
     */
    async create(
        data: Pick<HeroImage, "name" | "description" | "fileId" | "podcastId" | "episodeId" | "urlTo">,
    ): Promise<HeroImage & OptimizedHeroImage> {
        // Cast to Omit<HeroImage, "id" | "createdAt" | "updatedAt"> since the 'file', 'podcast', and 'episode'
        // properties will be populated by the database adapter
        const heroImage = await super.create(data as Omit<HeroImage, "id" | "createdAt" | "updatedAt">);
        const optimizedHeroImage = await this.prepareHeroImageFiles(heroImage);
        return { ...heroImage, ...optimizedHeroImage };
    }

    /**
     * Override delete to handle reference checks
     */
    async delete(id: number): Promise<void> {
        const heroImage = await this.get(id);
        if (!heroImage) {
            throw new Error("Hero image not found");
        }

        // Check if this hero image is referenced in site settings or other entities
        await heroReferenceService.handleHeroImageDelete(id);

        await super.delete(id);
    }

    /**
     * Get a hero image by file ID
     */
    async getByFileId(fileId: string): Promise<HeroImage | null> {
        const heroImages = await this.list();
        return heroImages.find((hi) => hi.fileId === fileId) || null;
    }

    /**
     * Get a hero image by podcast ID
     */
    async getByPodcastId(podcastId: number): Promise<HeroImage | null> {
        const heroImages = await this.list();
        return heroImages.find((hi) => hi.podcastId === podcastId) || null;
    }

    /**
     * Get a hero image by episode ID
     */
    async getByEpisodeId(episodeId: number): Promise<HeroImage | null> {
        const heroImages = await this.list();
        return heroImages.find((hi) => hi.episodeId === episodeId) || null;
    }

    /**
     * Gets the optimized image URLs for a file without processing
     */
    async getOptimizedImageUrls(fileId: string): Promise<OptimizedHeroImage | null> {
        const fileMetadata = await filesService.get(fileId);
        if (!fileMetadata) {
            return null;
        }

        // Generate URLs for all sizes
        const images = Object.entries(IMAGE_SIZES).map(([size, width]) => {
            const { webpUrl, jpegUrl } = this.getHeroImageUrls(fileId, size);

            return {
                size,
                width,
                paths: {
                    webp: webpUrl,
                    jpeg: jpegUrl,
                },
            };
        });

        // Use structured placeholder URL
        const placeholderUrl = `/api/files/optimized/${fileId}/hero/placeholder.webp`;

        return {
            success: true,
            images,
            placeholder: placeholderUrl,
        };
    }

    /**
     * Prepare hero image files for all required sizes
     */
    async prepareHeroImageFiles(heroImage: HeroImage): Promise<OptimizedHeroImage> {
        const fileMetadata = await filesService.get(heroImage.fileId);
        if (!fileMetadata) {
            throw new Error("File not found");
        }

        const heroImagesPath = join(
            this.appDataDir,
            fileMetadata.path.replace(fileMetadata.id, "").replace(fileMetadata.extension, ""),
        );

        // Convert File to Buffer
        const bytes = await readFile(`${this.appDataDir}/${fileMetadata.path}`);
        const buffer = Buffer.from(bytes);

        // Initialize Sharp with the buffer
        const image = sharp(buffer);

        // Get image metadata
        const metadata = await image.metadata();
        const originalWidth = metadata.width || 3840;

        // Generate optimized versions
        const optimizedImages = await Promise.all(
            Object.entries(IMAGE_SIZES).map(async ([size, width]) => {
                // Only resize if original is larger than target
                const shouldResize = originalWidth > width;
                const pipeline = shouldResize
                    ? image.clone().resize(width, undefined, {
                          fit: "cover",
                          withoutEnlargement: true,
                      })
                    : image.clone();

                // Generate WebP
                const webpBuffer = await pipeline.webp({ quality: 85, effort: 6 }).toBuffer();

                // Generate JPEG fallback
                const jpegBuffer = await pipeline.jpeg({ quality: 85, progressive: true }).toBuffer();

                // Get paths using the new method
                const { baseFilename, webpUrl, jpegUrl } = this.getHeroImageUrls(fileMetadata.id, size);

                // File paths for local storage
                const webpPath = join(heroImagesPath, `${baseFilename}.webp`);
                const jpegPath = join(heroImagesPath, `${baseFilename}.jpg`);

                // Save both versions
                await Promise.all([writeFile(webpPath, webpBuffer), writeFile(jpegPath, jpegBuffer)]);

                return {
                    size,
                    width,
                    paths: {
                        webp: webpUrl,
                        jpeg: jpegUrl,
                    },
                };
            }),
        );

        // Generate a low-quality placeholder
        const placeholderBuffer = await image
            .resize(20, undefined, { fit: "cover" })
            .blur(5)
            .webp({ quality: 20 })
            .toBuffer();

        // Save the placeholder image file
        const placeholderFilename = `${fileMetadata.id}-hero-placeholder.webp`;
        const placeholderPath = join(heroImagesPath, placeholderFilename);
        await writeFile(placeholderPath, placeholderBuffer);

        // Get the placeholder URL using the new structure
        const placeholderUrl = `/api/files/optimized/${fileMetadata.id}/hero/placeholder.webp`;

        // Convert the placeholder to base64 for inline use
        const placeholderBase64 = `data:image/webp;base64,${placeholderBuffer.toString("base64")}`;

        return {
            success: true,
            images: optimizedImages,
            placeholder: placeholderBase64,
        };
    }

    getHeroImageUrls(
        fileId: string,
        size: string,
    ): { baseFilename: string; webpUrl: string; jpegUrl: string } {
        return {
            baseFilename: `${fileId}-hero-${size}`,
            webpUrl: `/api/files/optimized/${fileId}/hero/${size}.webp`,
            jpegUrl: `/api/files/optimized/${fileId}/hero/${size}.jpg`,
        };
    }
}

// Export a singleton instance
export const heroImageService = new HeroImageServiceImpl();

// Export the interface for better type inference
export type { HeroImageService };
export type { OptimizedHeroImage };
