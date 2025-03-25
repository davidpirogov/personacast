export const THEME_PATHS = {
    "/": "landing",
    "/podcasts": "landing",
    "/studio": "workzone",
    "/admin": "workzone",
};

/**
 * Determines the appropriate theme based on the current URL path.
 *
 * @param path - The current URL path to evaluate
 * @returns The matched theme name ("landing" or "workzone")
 *
 * Resolution algorithm:
 * 1. First checks for an exact match in THEME_PATHS
 * 2. If no exact match, looks for a path prefix match (ignoring root path "/")
 * 3. Falls back to "landing" theme if no matches are found
 *
 * Example mappings:
 * - "/" → "landing"
 * - "/podcasts" → "landing"
 * - "/podcasts/episode-1" → "landing" (prefix match)
 * - "/studio" → "workzone"
 * - "/studio/editor" → "workzone" (prefix match)
 * - "/admin" → "workzone"
 * - "/unknown-path" → "landing" (default)
 */
export const getThemeForPath = (path: string) => {
    // First check for exact matches
    if (path in THEME_PATHS) {
        return THEME_PATHS[path as keyof typeof THEME_PATHS];
    }

    // Then check for path prefix matches
    for (const [pathPrefix, theme] of Object.entries(THEME_PATHS)) {
        if (path.startsWith(pathPrefix) && pathPrefix !== "/") {
            return theme;
        }
    }

    return "landing";
};
