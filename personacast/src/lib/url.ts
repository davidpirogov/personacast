export function getBaseUrl() {
    if (typeof window !== "undefined") {
        return ""; // browser should use relative url
    }

    if (process.env.AUTH_API_BASE_URL) {
        return `https://${process.env.AUTH_API_BASE_URL}`; // SSR should use public URL
    }

    return `http://localhost:${process.env.PORT || 3000}`; // dev SSR should use localhost
}
