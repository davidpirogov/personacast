export const landingThemeClasses =
    "fixed top-0 z-50 w-full bg-background/5 backdrop-blur-lg border-b border-white/10 supports-[backdrop-filter]:bg-background/5 landing:text-gray-200 transition-all duration-300 ease-in-out";

export const adminThemeClasses =
    "fixed top-0 z-50 w-full bg-white backdrop-blur-lg border-b border-gray-200 supports-[backdrop-filter]:bg-white/95 workzone:text-gray-900 transition-all duration-300 ease-in-out";

export const navBarClasses = (useLandingTheme: boolean) => {
    const theme = useLandingTheme ? "landing" : "workzone";
    return `${useLandingTheme ? landingThemeClasses : adminThemeClasses} data-theme="${theme}"`;
};
