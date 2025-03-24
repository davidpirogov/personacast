import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge.
 * This utility helps manage Tailwind CSS classes by properly merging them and removing conflicts.
 *
 * @param inputs - Array of class names or conditional class objects
 * @returns Merged and sanitized class string
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-2', 'py-1', 'bg-blue-500')
 *
 * // With conditions
 * cn('px-2', isActive && 'bg-blue-500', isBig ? 'text-lg' : 'text-base')
 *
 * // With Tailwind conflicts resolved
 * cn('px-2 py-1', 'px-4') // px-4 will override px-2
 * ```
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a byte value into a human-readable string with appropriate unit.
 * Automatically selects the best unit (B, KB, MB, GB) based on the size.
 *
 * @param bytes - The number of bytes to format
 * @param precision - Number of decimal places to show (default: 0)
 * @returns Formatted string with unit (e.g., "1.5MB" with precision 1, "2MB" with precision 0)
 *
 * @example
 * ```typescript
 * formatBytes(1024)        // "1KB"
 * formatBytes(1234567)     // "1MB"
 * formatBytes(1234567, 1)  // "1.2MB"
 * formatBytes(500)         // "500B"
 * ```
 *
 * @remarks
 * - Uses specified precision for decimal places (defaults to 0 for whole numbers)
 * - Supports up to YB units
 * - Uses 1024 (2^10) as the conversion factor between units
 */
export function formatBytes(bytes: number, precision: number = 0): string {
    const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${Number(size.toFixed(precision))}${units[unitIndex]}`;
}

/**
 * Validates if a string is a valid UUID v4.
 * Checks for the standard UUID v4 format: 8-4-4-4-12 characters with specific version and variant bits.
 *
 * @param id - The string to validate as UUID
 * @returns boolean indicating if the string is a valid UUID v4
 *
 * @example
 * ```typescript
 * isValidUUID('123e4567-e89b-42d3-a456-556642440000') // true
 * isValidUUID('not-a-uuid')                            // false
 * ```
 *
 * @remarks
 * - Case insensitive validation
 * - Specifically validates UUID version 4 (third group starts with 4)
 * - Validates variant bits (first character of fourth group is 8, 9, a, or b)
 */
export function isValidUUID(id: string): boolean {
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return UUID_REGEX.test(id);
}
