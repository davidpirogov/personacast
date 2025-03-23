// Safe file path pattern: alphanumeric, forward slashes, hyphens, underscores, and dots
export const SAFE_PATH_PATTERN = /^[a-zA-Z0-9\/\-_.]+$/;
export const SAFE_PATH_REPLACE_PATTERN = /[^a-zA-Z0-9\/\-_.]/g;

// Security constants
export const MAX_PATH_LENGTH = 256;
export const MAX_SEGMENTS = 10;

// Custom error classes
export class InvalidPathError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidPathError";
    }
}

export class FileNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileNotFoundError";
    }
}

/**
 * Validates a path array for security and length constraints
 * @param pathSegments Array of path segments to validate
 * @throws {InvalidPathError} If path validation fails
 */
export function validatePath(pathSegments: string[]): void {
    if (!pathSegments?.length) {
        console.error("No path provided");
        throw new InvalidPathError("No path provided");
    }

    // Check segment count
    if (pathSegments.length > MAX_SEGMENTS) {
        console.error("Invalid path exceeds max segments (", MAX_SEGMENTS, "):", pathSegments);
        throw new InvalidPathError("Path exceeds maximum allowed segments");
    }

    // Check total path length
    if (pathSegments.join("/").length > MAX_PATH_LENGTH) {
        console.error("Invalid path exceeds max length (", MAX_PATH_LENGTH, " characters):", pathSegments);
        throw new InvalidPathError("Path exceeds maximum allowed length");
    }

    // Check for absolute paths and null bytes
    if (pathSegments.some((segment) => segment.startsWith("/") || segment.includes("\0"))) {
        console.error("Invalid payload with absolute path or null byte:", pathSegments);
        throw new InvalidPathError("Path contains invalid characters");
    }

    // Normalize and validate path segments
    const normalizedPath = pathSegments.map((segment) => decodeURIComponent(segment).normalize("NFKC"));

    // Check for invalid characters
    const hasInvalidChars = normalizedPath.some((segment) => !segment.match(SAFE_PATH_PATTERN));
    if (hasInvalidChars) {
        console.error("Invalid characters in path:", normalizedPath);
        throw new InvalidPathError("Path contains invalid characters");
    }
}
