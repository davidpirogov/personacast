// Safe file path pattern: alphanumeric, forward slashes, hyphens, underscores, and dots
export const SAFE_PATH_PATTERN = /^[a-zA-Z0-9\/\-_.]+$/;
export const SAFE_PATH_REPLACE_PATTERN = /[^a-zA-Z0-9\/\-_.]/g;

// Security constants
export const MAX_PATH_LENGTH = 256;
export const MAX_SEGMENTS = 10;

// Valid hero image parameters
export const VALID_HERO_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl", "placeholder"];
export const VALID_IMAGE_EXTENSIONS = ["webp", "jpg", "jpeg"];

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

/**
 * Validates a path for optimized hero images with specific format requirements
 * Expected path format: [fileId]/hero/[size].[ext] or [fileId]/hero/placeholder.webp
 *
 * @param pathSegments Array of path segments to validate
 * @returns An object with validated and parsed path components
 * @throws {InvalidPathError} If path validation fails
 */
export function validateOptimizedImagePath(pathSegments: string[]): {
    fileId: string;
    type: string;
    size: string;
    extension: string;
} {
    // First validate using the general path validation
    validatePath(pathSegments);

    // Check if we have enough segments for an optimized image path
    if (pathSegments.length < 3) {
        console.error("Invalid optimized image path format, not enough segments:", pathSegments);
        throw new InvalidPathError("Invalid path format for optimized image");
    }

    const fileId = pathSegments[0];
    const type = pathSegments[1];

    // Currently we only support "hero" type
    if (type !== "hero") {
        console.error("Unsupported optimization type:", type);
        throw new InvalidPathError("Unsupported optimization type");
    }

    // Parse size and extension from the last segment
    let size: string;
    let extension: string;

    if (pathSegments[2] === "placeholder.webp") {
        size = "placeholder";
        extension = "webp";
    } else {
        const lastSegment = pathSegments[2];
        const dotIndex = lastSegment.lastIndexOf(".");

        if (dotIndex === -1) {
            console.error("Invalid file format, missing extension:", lastSegment);
            throw new InvalidPathError("Invalid file format");
        }

        size = lastSegment.substring(0, dotIndex);
        extension = lastSegment.substring(dotIndex + 1);
    }

    // Validate size
    if (!VALID_HERO_SIZES.includes(size)) {
        console.error("Invalid hero image size:", size);
        throw new InvalidPathError("Invalid size parameter");
    }

    // Validate extension
    if (!VALID_IMAGE_EXTENSIONS.includes(extension)) {
        console.error("Invalid image extension:", extension);
        throw new InvalidPathError("Invalid file extension");
    }

    return {
        fileId,
        type,
        size,
        extension,
    };
}
