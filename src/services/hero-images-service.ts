import { HeroImagesAdapter } from "@/lib/database/adapters/hero-images";
import { HeroImage, HeroImagesAdapterType } from "@/types/database";
import { HeroImageService } from "@/types/services";
import { FILES_DIR, filesService } from "./files-service";
import { basename, join } from "path";
import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu";
import { heroReferenceService } from "@/services/hero-reference-service";

// Define image sizes for different viewports
const IMAGE_SIZES = {
    xs: 320,
    sm: 640,
    md: 1080,
    lg: 1920,
    xl: 2560,
    "2xl": 3840,
} as const;

export interface OptimizedHeroImage {
    success: boolean;
    images: { size: string; width: number; paths: { webp: string; jpeg: string } }[];
    placeholder: string;
}

export class DefaultHeroImageService implements HeroImageService {
    private adapter: HeroImagesAdapterType;
    private appDataDir: string;
    private readonly HERO_IMAGES_PATH_PREFIX = "hero";

    constructor() {
        this.adapter = new HeroImagesAdapter();

        if (!process.env.APP_DATA) {
            throw new Error("APP_DATA is not set");
        }

        this.appDataDir = process.env.APP_DATA;
    }

    async list(): Promise<HeroImage[]> {
        return this.adapter.getAll();
    }

    async get(id: number): Promise<HeroImage | null> {
        return this.adapter.getById(id);
    }

    async create(
        data: Pick<HeroImage, "name" | "description" | "fileId" | "podcastId" | "episodeId" | "urlTo">,
    ): Promise<HeroImage & OptimizedHeroImage> {
        const heroImage = await this.adapter.create(data);

        const optimizedHeroImage = await this.prepareHeroImageFiles(heroImage);

        return { ...heroImage, ...optimizedHeroImage };
    }

    /**
     * Generates file paths for hero images of different sizes
     */
    private getHeroImagePaths(fileId: string, size: string) {
        // Create a more structured URL pattern that maps to API routes
        const baseFilename = `${fileId}-hero-${size}`;
        const webpUrl = `/api/files/optimized/${fileId}/hero/${size}.webp`;
        const jpegUrl = `/api/files/optimized/${fileId}/hero/${size}.jpg`;

        return {
            baseFilename,
            webpUrl,
            jpegUrl,
        };
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
            const { webpUrl, jpegUrl } = this.getHeroImagePaths(fileId, size);

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
                const { baseFilename, webpUrl, jpegUrl } = this.getHeroImagePaths(fileMetadata.id, size);

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

    async update(
        id: number,
        data: Partial<Omit<HeroImage, "id" | "createdAt" | "updatedAt">>,
    ): Promise<HeroImage> {
        return this.adapter.update(id, data);
    }

    async delete(id: number): Promise<void> {
        const heroImage = await this.get(id);
        if (!heroImage) {
            throw new Error("Hero image not found");
        }

        // Check if this hero image is referenced in site settings or other entities
        await heroReferenceService.handleHeroImageDelete(id);

        await this.adapter.delete(id);
    }

    async getByFileId(fileId: string): Promise<HeroImage | null> {
        const heroImages = await this.list();
        return heroImages.find((hi) => hi.fileId === fileId) || null;
    }

    async getByPodcastId(podcastId: number): Promise<HeroImage | null> {
        const heroImages = await this.list();
        return heroImages.find((hi) => hi.podcastId === podcastId) || null;
    }

    async getByEpisodeId(episodeId: number): Promise<HeroImage | null> {
        const heroImages = await this.list();
        return heroImages.find((hi) => hi.episodeId === episodeId) || null;
    }
}

export const heroImagesService = new DefaultHeroImageService();
