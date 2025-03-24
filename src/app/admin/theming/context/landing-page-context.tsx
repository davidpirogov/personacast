"use client";

import { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import { SiteSettings } from "../defaults";
import { OptimizedImage } from "../types";
import { formatBytes } from "@/lib/utils";

// Define the image upload state
interface ImageUploadState {
    status: "idle" | "uploading" | "success" | "error";
    type: "url" | "upload" | "default";
    url?: string;
    uploadedFile?: File;
    previewUrl: string | null;
    error: string | null;
    optimizedImages: OptimizedImage[];
}

// Unified state that combines settings and image upload
interface LandingPageState {
    settings: SiteSettings;
    imageUpload: ImageUploadState;
    isDirty: boolean;
    isLoading: boolean;
    error: string | null;
}

// Available actions for components to use
interface LandingPageActions {
    updateSettings: (updates: Partial<SiteSettings>) => void;
    uploadImage: (file: File) => Promise<void>;
    submitImageUrl: (url: string) => Promise<void>;
    resetImageUpload: () => void;
    saveChanges: () => Promise<void>;
    resetChanges: () => void;
}

// Combined type for the context value
type LandingPageContextType = LandingPageState & LandingPageActions;

// Create the context
const LandingPageContext = createContext<LandingPageContextType | null>(null);

// Action types
type LandingPageAction =
    | { type: "UPDATE_SETTINGS"; payload: Partial<SiteSettings> }
    | { type: "IMAGE_UPLOAD_START" }
    | { type: "IMAGE_UPLOAD_SUCCESS"; payload: { file: File; previewUrl: string } }
    | { type: "IMAGE_URL_SUCCESS"; payload: string }
    | { type: "SET_OPTIMIZED_IMAGES"; payload: OptimizedImage[] }
    | { type: "UPDATE_SETTINGS_FROM_UPLOAD"; payload: { fileId: string; optimizedImages: OptimizedImage[] } }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SAVE_SUCCESS"; payload: SiteSettings }
    | { type: "RESET_IMAGE_UPLOAD" }
    | { type: "RESET_ALL"; payload: SiteSettings };

// Initial state
const initialImageUploadState: ImageUploadState = {
    status: "idle",
    type: "default",
    previewUrl: null,
    error: null,
    optimizedImages: [],
};

// Reducer function
function landingPageReducer(state: LandingPageState, action: LandingPageAction): LandingPageState {
    switch (action.type) {
        case "UPDATE_SETTINGS":
            return {
                ...state,
                settings: { ...state.settings, ...action.payload },
                isDirty: true,
            };

        case "IMAGE_UPLOAD_START":
            return {
                ...state,
                imageUpload: {
                    ...state.imageUpload,
                    status: "uploading",
                    error: null,
                },
                isLoading: true,
            };

        case "IMAGE_UPLOAD_SUCCESS":
            return {
                ...state,
                imageUpload: {
                    ...state.imageUpload,
                    status: "success",
                    type: "upload",
                    uploadedFile: action.payload.file,
                    previewUrl: action.payload.previewUrl,
                    url: undefined,
                },
                isLoading: false,
            };

        case "IMAGE_URL_SUCCESS":
            return {
                ...state,
                imageUpload: {
                    ...state.imageUpload,
                    status: "success",
                    type: "url",
                    url: action.payload,
                    previewUrl: action.payload,
                    uploadedFile: undefined,
                },
                isLoading: false,
                isDirty: true,
            };

        case "SET_OPTIMIZED_IMAGES":
            return {
                ...state,
                imageUpload: {
                    ...state.imageUpload,
                    optimizedImages: action.payload,
                },
            };

        case "UPDATE_SETTINGS_FROM_UPLOAD":
            // This is the critical action that prevents loops by updating settings once with upload data
            return {
                ...state,
                settings: {
                    ...state.settings,
                    hero: {
                        ...state.settings.hero,
                        fileId: action.payload.fileId,
                        images: action.payload.optimizedImages,
                        placeholder:
                            action.payload.optimizedImages.find((img) => img.size === "placeholder")?.paths
                                .webp || null,
                    },
                },
                isDirty: true,
            };

        case "SET_LOADING":
            return { ...state, isLoading: action.payload };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                imageUpload: {
                    ...state.imageUpload,
                    status: action.payload ? "error" : state.imageUpload.status,
                    error: action.payload,
                },
                isLoading: false,
            };

        case "SAVE_SUCCESS":
            return {
                ...state,
                settings: action.payload,
                isDirty: false,
                isLoading: false,
                error: null,
            };

        case "RESET_IMAGE_UPLOAD":
            return {
                ...state,
                imageUpload: initialImageUploadState,
            };

        case "RESET_ALL":
            return {
                ...state,
                settings: action.payload,
                imageUpload: initialImageUploadState,
                isDirty: false,
                isLoading: false,
                error: null,
            };

        default:
            return state;
    }
}

// Provider component
interface LandingPageProviderProps {
    children: ReactNode;
    initialSettings: SiteSettings;
}

export function LandingPageProvider({ children, initialSettings }: LandingPageProviderProps) {
    // Initialize state with initial settings
    const [state, dispatch] = useReducer(landingPageReducer, {
        settings: initialSettings,
        imageUpload: initialImageUploadState,
        isDirty: false,
        isLoading: false,
        error: null,
    });

    // Update settings method (for form fields, etc.)
    const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
        dispatch({ type: "UPDATE_SETTINGS", payload: updates });
    }, []);

    // Image upload handler
    const uploadImage = useCallback(async (file: File) => {
        try {
            dispatch({ type: "IMAGE_UPLOAD_START" });

            // Validate file type
            if (!file.type.startsWith("image/")) {
                throw new Error("Please upload an image file");
            }

            // Validate file size (max 100MB)
            if (file.size > parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE || "100000000")) {
                const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE || "100000000");
                throw new Error(
                    `Image size should be less than ${formatBytes(maxSize)} (${maxSize.toLocaleString()} bytes)`,
                );
            }

            // Create a local preview URL
            const previewUrl = URL.createObjectURL(file);
            dispatch({
                type: "IMAGE_UPLOAD_SUCCESS",
                payload: { file, previewUrl },
            });

            // Prepare form data for upload
            const formData = new FormData();
            formData.append("file", file);

            // Upload the file
            const response = await fetch("/api/files/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Upload failed");
            }

            // Set as hero image
            const setHeroImageResponse = await fetch(`/api/files/hero`, {
                method: "POST",
                body: JSON.stringify({
                    fileId: data.file.id,
                    name: "Landing page hero image",
                    description: "This image is used as the hero image for the landing page",
                    urlTo: "/",
                    podcastId: null,
                    episodeId: null,
                }),
            });

            if (!setHeroImageResponse.ok) {
                throw new Error("Failed to set hero image");
            }

            const setHeroImageData = await setHeroImageResponse.json();

            // Set optimized images
            dispatch({ type: "SET_OPTIMIZED_IMAGES", payload: setHeroImageData.images });

            // Extract file ID from the first optimized image path
            if (setHeroImageData.images.length > 0) {
                const path = setHeroImageData.images[0].paths.webp;
                const matches = path.match(/\/api\/files\/optimized\/([^\/]+)\/hero\//);
                const fileId = matches ? matches[1] : "";

                if (fileId) {
                    // Update settings in a single action to prevent loops
                    dispatch({
                        type: "UPDATE_SETTINGS_FROM_UPLOAD",
                        payload: {
                            fileId,
                            optimizedImages: setHeroImageData.images,
                        },
                    });
                }
            }
        } catch (err) {
            dispatch({
                type: "SET_ERROR",
                payload: err instanceof Error ? err.message : "Failed to upload image",
            });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, []);

    // URL image submission handler
    const submitImageUrl = useCallback(
        async (url: string) => {
            try {
                dispatch({ type: "IMAGE_UPLOAD_START" });

                // Basic URL validation
                const urlPattern = /^https?:\/\/.+\/.+$/;
                if (!urlPattern.test(url)) {
                    throw new Error("Please enter a valid image URL");
                }

                // Test if the URL points to an image
                const response = await fetch(url, { method: "HEAD" });
                const contentType = response.headers.get("content-type");
                if (!contentType?.startsWith("image/")) {
                    throw new Error("URL does not point to a valid image");
                }

                dispatch({ type: "IMAGE_URL_SUCCESS", payload: url });

                // For URL-based images, we update settings directly
                updateSettings({
                    hero: {
                        ...state.settings.hero,
                        fileId: url, // Store URL as fileId for URL-based images
                    },
                });
            } catch (err) {
                dispatch({
                    type: "SET_ERROR",
                    payload: err instanceof Error ? err.message : "Failed to load image from URL",
                });
            } finally {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        },
        [state.settings.hero, updateSettings],
    );

    // Reset image upload
    const resetImageUpload = useCallback(() => {
        if (state.imageUpload.previewUrl && state.imageUpload.type === "upload") {
            URL.revokeObjectURL(state.imageUpload.previewUrl);
        }
        dispatch({ type: "RESET_IMAGE_UPLOAD" });
    }, [state.imageUpload.previewUrl, state.imageUpload.type]);

    // Save changes to the server
    const saveChanges = useCallback(async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            dispatch({ type: "SET_ERROR", payload: null });

            // Get the current site_settings variable
            const getResponse = await fetch(`/api/variables/by-name/system.site_settings`, {
                method: "GET",
            });

            if (!getResponse.ok) {
                const errorData = await getResponse.json();
                throw new Error(errorData.error || "Failed to get current settings");
            }

            const currentVariable = await getResponse.json();

            // Update the site_settings variable
            const response = await fetch(`/api/variables/${currentVariable.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: "system.site_settings",
                    value: JSON.stringify(state.settings),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save settings");
            }

            const updatedVariable = await response.json();
            const parsedSettings = JSON.parse(updatedVariable.value);

            dispatch({ type: "SAVE_SUCCESS", payload: parsedSettings });
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload: error instanceof Error ? error.message : "Failed to save settings",
            });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [state.settings]);

    // Reset all changes
    const resetChanges = useCallback(() => {
        // Revoke any object URLs to prevent memory leaks
        if (state.imageUpload.previewUrl && state.imageUpload.type === "upload") {
            URL.revokeObjectURL(state.imageUpload.previewUrl);
        }
        dispatch({ type: "RESET_ALL", payload: initialSettings });
    }, [initialSettings, state.imageUpload.previewUrl, state.imageUpload.type]);

    // Create the context value
    const contextValue: LandingPageContextType = {
        ...state,
        updateSettings,
        uploadImage,
        submitImageUrl,
        resetImageUpload,
        saveChanges,
        resetChanges,
    };

    return <LandingPageContext.Provider value={contextValue}>{children}</LandingPageContext.Provider>;
}

// Hook for consuming the context
export function useLandingPage() {
    const context = useContext(LandingPageContext);
    if (!context) {
        throw new Error("useLandingPage must be used within a LandingPageProvider");
    }
    return context;
}
