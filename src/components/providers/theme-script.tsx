"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// This component renders a script tag that runs on the client to set
// the theme attribute on the body element before React hydration
export function ThemeScript() {
    const pathname = usePathname();

    // Function to determine the theme based on path
    const getTheme = (path: string) => {
        return ["", "/", "/podcasts"].includes(path) ? "landing" : "workzone";
    };

    // Set theme on initial render and when pathname changes
    useEffect(() => {
        document.body.setAttribute("data-theme", getTheme(pathname));
    }, [pathname]);

    // Inline script to set theme on initial page load before hydration
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
          (function() {
            var path = window.location.pathname;
            var isLandingPath = ['', '/', '/podcasts'].includes(path);
            document.body.setAttribute('data-theme', isLandingPath ? 'landing' : 'workzone');
          })();
        `,
            }}
        />
    );
}
