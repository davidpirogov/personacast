export interface SiteSettings {
    title: string;
    hero: {
        id: number | null;
        fileId: string | null;
        images: { size: string; width: number; paths: { webp: string; jpeg: string } }[];
        placeholder: string | null;
    };
    colors: {
        primary: {
            hsl: string;
            hex: string;
        };
        secondary: {
            hsl: string;
            hex: string;
        };
        accent: {
            hsl: string;
            hex: string;
        };
    };
}

export const SITE_SETTINGS_NAME = "system.site_settings";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
    title: "Personacast",
    hero: {
        id: null,
        fileId: null,
        images: [],
        placeholder: null,
    },
    colors: {
        primary: {
            hsl: "220 14% 24%", // From landing theme primary
            hex: "#323842",
        },
        secondary: {
            hsl: "215 28% 17%", // From landing theme secondary
            hex: "#1F2937",
        },
        accent: {
            hsl: "220 14% 34%", // From landing theme accent
            hex: "#464D5A",
        },
    },
};
