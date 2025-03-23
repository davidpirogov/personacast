// Map file extensions to MIME types (extending from download endpoint)
export const MIME_TYPES = {
    // Images
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    // Audio
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".wav": "audio/wav",
    // Video
    ".mp4": "video/mp4",
    ".webm": "video/webm",
} as const;
