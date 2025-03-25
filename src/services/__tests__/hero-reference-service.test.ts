import { heroReferenceService } from "../hero-reference-service";
import { variablesService } from "../variables-service";
import { heroImagesService } from "../hero-images-service";
import { DEFAULT_SITE_SETTINGS, SITE_SETTINGS_NAME } from "@/app/admin/theming/defaults";

// Mock all service dependencies
jest.mock("../variables-service");
jest.mock("../hero-images-service");
jest.mock("../podcast-service");
jest.mock("../episode-service");

describe("HeroReferenceService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("isFileReferencedInSiteSettings", () => {
        it("should return false if site settings variable not found", async () => {
            (variablesService.getByName as jest.Mock).mockResolvedValue(null);

            const result = await heroReferenceService.isFileReferencedInSiteSettings("file-id");

            expect(result).toBe(false);
            expect(variablesService.getByName).toHaveBeenCalledWith(SITE_SETTINGS_NAME);
        });

        it("should return true if file is referenced in site settings", async () => {
            const fileId = "test-file-id";
            const siteSettings = {
                ...DEFAULT_SITE_SETTINGS,
                hero: {
                    ...DEFAULT_SITE_SETTINGS.hero,
                    fileId,
                },
            };

            (variablesService.getByName as jest.Mock).mockResolvedValue({
                id: 1,
                value: JSON.stringify(siteSettings),
            });

            const result = await heroReferenceService.isFileReferencedInSiteSettings(fileId);

            expect(result).toBe(true);
        });
    });

    describe("resetSiteSettingsHeroImage", () => {
        it("should update site settings with default hero image", async () => {
            const siteSettings = {
                title: "Custom Title",
                description: "Custom Description",
                hero: {
                    fileId: "custom-file-id",
                    images: [],
                    placeholder: "custom-placeholder",
                },
                colors: DEFAULT_SITE_SETTINGS.colors,
            };

            (variablesService.getByName as jest.Mock).mockResolvedValue({
                id: 1,
                value: JSON.stringify(siteSettings),
            });

            await heroReferenceService.resetSiteSettingsHeroImage();

            // Verify site settings were updated with default hero
            expect(variablesService.update).toHaveBeenCalledWith(1, {
                value: expect.stringContaining(DEFAULT_SITE_SETTINGS.hero.fileId as string),
            });

            // Parse the JSON to verify correct structure
            const updatedSettings = JSON.parse((variablesService.update as jest.Mock).mock.calls[0][1].value);

            expect(updatedSettings.hero).toEqual(DEFAULT_SITE_SETTINGS.hero);
            expect(updatedSettings.title).toBe(siteSettings.title); // Other fields preserved
        });
    });

    describe("handleFileDelete", () => {
        it("should reset site settings if file is referenced", async () => {
            const fileId = "test-file-id";

            // File is referenced in site settings
            jest.spyOn(heroReferenceService, "isFileReferencedInSiteSettings").mockResolvedValue(true);

            // Spy on resetSiteSettingsHeroImage
            jest.spyOn(heroReferenceService, "resetSiteSettingsHeroImage").mockResolvedValue();

            // File is used in a hero image
            (heroImagesService.getByFileId as jest.Mock).mockResolvedValue({
                id: 1,
                fileId,
            });

            // Hero image is used by podcasts and episodes
            jest.spyOn(heroReferenceService, "findPodcastsWithHeroImage").mockResolvedValue([1, 2]);

            jest.spyOn(heroReferenceService, "findEpisodesWithHeroImage").mockResolvedValue([3, 4]);

            // Spies for reset methods
            jest.spyOn(heroReferenceService, "resetPodcastHeroImage").mockResolvedValue();

            jest.spyOn(heroReferenceService, "resetEpisodeHeroImage").mockResolvedValue();

            await heroReferenceService.handleFileDelete(fileId);

            // Verify site settings were reset
            expect(heroReferenceService.resetSiteSettingsHeroImage).toHaveBeenCalled();

            // Verify podcast hero images were reset
            expect(heroReferenceService.resetPodcastHeroImage).toHaveBeenCalledWith(1);
            expect(heroReferenceService.resetPodcastHeroImage).toHaveBeenCalledWith(2);

            // Verify episode hero images were reset
            expect(heroReferenceService.resetEpisodeHeroImage).toHaveBeenCalledWith(3);
            expect(heroReferenceService.resetEpisodeHeroImage).toHaveBeenCalledWith(4);
        });
    });
});
