"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface ThemeProviderProps {
    className?: string;
    children: ReactNode;
}

export function ThemeProvider({ className, children }: ThemeProviderProps) {
    const pathname = usePathname();

    // Define paths that should use the landing theme
    const isLandingThemePath = ["", "/", "/podcasts"].includes(pathname);

    return (
        <body 
            data-theme={isLandingThemePath ? "landing" : "workzone"} 
            className={`${className} transition-colors duration-300 ease-in-out`}
        >
            {children}
        </body>
    );
}
