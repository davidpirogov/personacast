"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getThemeForPath } from "./theme-paths";

// This component handles setting the theme based on the current path
export function ThemeScript() {
    const pathname = usePathname();

    // Function to determine the theme based on path
    const getTheme = (path: string) => {
        return getThemeForPath(path);
    };

    // Set theme when component mounts and when pathname changes
    // This runs after hydration so there won't be hydration mismatches
    useEffect(() => {
        const theme = getTheme(pathname);
        document.body.setAttribute("data-theme", theme);
    }, [pathname]);

    // Return null instead of a script tag to avoid hydration issues
    return null;
}
