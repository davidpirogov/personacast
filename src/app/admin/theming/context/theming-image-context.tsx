"use client";

import { createContext, useContext, useCallback, useReducer, ReactNode } from "react";
import { ThemingImageContextType, ThemingImageState } from "../types";
import { formatBytes } from "@/lib/utils";
import { set } from "zod";

const ThemingImageContext = createContext<ThemingImageContextType | null>(null);

interface ThemingImageProviderProps {
    children: ReactNode;
}

type ThemingImageAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_URL_IMAGE"; payload: string }
    | { type: "SET_UPLOADED_IMAGE"; payload: { file: File; previewUrl: string } }
    | { type: "SET_OPTIMIZED_IMAGES"; payload: ThemingImageState["optimizedImages"] }
    | { type: "RESET" };

const initialState: ThemingImageState = {
    type: "default",
    previewUrl: null,
    isLoading: false,
    error: null,
    optimizedImages: [],
};

function themingImageReducer(state: ThemingImageState, action: ThemingImageAction): ThemingImageState {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "SET_URL_IMAGE":
            return {
                ...state,
                type: "url",
                url: action.payload,
                uploadedImage: undefined,
                previewUrl: action.payload,
            };
        case "SET_UPLOADED_IMAGE":
            return {
                ...state,
                type: "upload",
                uploadedImage: action.payload.file,
                previewUrl: action.payload.previewUrl,
                url: undefined,
            };
        case "SET_OPTIMIZED_IMAGES":
            return { ...state, optimizedImages: action.payload };
        case "RESET":
            return initialState;
        default:
            return state;
    }
}

export function ThemingImageProvider({ children }: ThemingImageProviderProps) {
    const [state, dispatch] = useReducer(themingImageReducer, initialState);

    const handleUpload = useCallback(async (file: File) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            dispatch({ type: "SET_ERROR", payload: null });

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

            const previewUrl = URL.createObjectURL(file);
            dispatch({
                type: "SET_UPLOADED_IMAGE",
                payload: { file, previewUrl },
            });

            const formData = new FormData();
            formData.append("file", file);

            // File upload endpoint call
            const response = await fetch("/api/files/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data);
            }

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

            dispatch({ type: "SET_OPTIMIZED_IMAGES", payload: setHeroImageData.images });
        } catch (err) {
            dispatch({
                type: "SET_ERROR",
                payload: err instanceof Error ? err.message : "Failed to upload image",
            });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, []);

    const handleUrlSubmit = useCallback(async (url: string) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            dispatch({ type: "SET_ERROR", payload: null });

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

            dispatch({ type: "SET_URL_IMAGE", payload: url });
        } catch (err) {
            dispatch({
                type: "SET_ERROR",
                payload: err instanceof Error ? err.message : "Failed to load image from URL",
            });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, []);

    const handleReset = useCallback(() => {
        if (state.previewUrl) {
            URL.revokeObjectURL(state.previewUrl);
        }
        dispatch({ type: "RESET" });
    }, [state.previewUrl]);

    const contextValue: ThemingImageContextType = {
        ...state,
        onUpload: handleUpload,
        onUrlSubmit: handleUrlSubmit,
        onReset: handleReset,
    };

    return <ThemingImageContext.Provider value={contextValue}>{children}</ThemingImageContext.Provider>;
}

export function useThemingImage() {
    const context = useContext(ThemingImageContext);
    if (!context) {
        throw new Error("useThemingImage must be used within a ThemingImageProvider");
    }
    return context;
}
