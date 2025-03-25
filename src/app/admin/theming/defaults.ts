export interface SiteSettings {
    title: string;
    description: string;
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
    description: "Podcasts with AI persona twist",
    hero: {
        id: null,
        fileId: "default-hero",
        images: [
            {
                size: "xs",
                width: 320,
                paths: {
                    webp: "/images/hero/default-hero-xs.webp",
                    jpeg: "/images/hero/default-hero-xs.jpg",
                },
            },
            {
                size: "sm",
                width: 640,
                paths: {
                    webp: "/images/hero/default-hero-sm.webp",
                    jpeg: "/images/hero/default-hero-sm.jpg",
                },
            },
            {
                size: "md",
                width: 1080,
                paths: {
                    webp: "/images/hero/default-hero-md.webp",
                    jpeg: "/images/hero/default-hero-md.jpg",
                },
            },
            {
                size: "lg",
                width: 1920,
                paths: {
                    webp: "/images/hero/default-hero-lg.webp",
                    jpeg: "/images/hero/default-hero-lg.jpg",
                },
            },
            {
                size: "xl",
                width: 2560,
                paths: {
                    webp: "/images/hero/default-hero-xl.webp",
                    jpeg: "/images/hero/default-hero-xl.jpg",
                },
            },
            {
                size: "2xl",
                width: 3840,
                paths: {
                    webp: "/images/hero/default-hero-2xl.webp",
                    jpeg: "/images/hero/default-hero-2xl.jpg",
                },
            },
        ],
        placeholder:
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAAAAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAAGABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAFQEBAQAAAAAAAAAAAAAAAAAABAX/2gAMAwEAAhADEAAAALdLRpJUP//EABgQAAIDAAAAAAAAAAAAAAAAAAABAhES/9oACAEBAAEFAoWLH//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABgQAAMBAQAAAAAAAAAAAAAAAAACEQEh/9oACAEBAAY/Aq8rsj//xAAZEAACAwEAAAAAAAAAAAAAAAABEQAhMVH/2gAIAQEAAT8hQA3C5Rpf/9oADAMBAAIAAwAAABA57//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Qf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Qf//EABoQAQACAwEAAAAAAAAAAAAAAAEAESExQZH/2gAIAQEAAT8QAB2zWqE3Cvy5UmY3P//Z",
    },
    colors: {
        primary: {
            hsl: "260 50% 60%",
            hex: "#8C5ED9",
        },
        secondary: {
            hsl: "220 70% 15%",
            hex: "#0F1A36",
        },
        accent: {
            hsl: "340 80% 65%",
            hex: "#F54F8A",
        },
    },
};
