"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { getThemeForPath } from "./theme-paths";
interface ThemeProviderProps {
    className?: string;
    children: ReactNode;
}

export function ThemeProvider({ className, children }: ThemeProviderProps) {
    const pathname = usePathname();

    // Define paths that should use the landing theme
    const theme = getThemeForPath(pathname);

    // Update the theme on the body element when pathname changes
    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    // Just render children with any additional classes
    return <div className={className}>{children}</div>;
}
