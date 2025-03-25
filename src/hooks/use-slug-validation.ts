import { useState, useRef, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";

interface UseSlugValidationProps {
    slug: string;
    originalSlug?: string;
    isGeneratingSlug: boolean;
}

interface ValidationState {
    status: "idle" | "checking" | "valid" | "invalid";
    message?: string;
}

export function useSlugValidation({ slug, originalSlug, isGeneratingSlug }: UseSlugValidationProps) {
    const [validationState, setValidationState] = useState<ValidationState>({ status: "idle" });
    const validatedSlugsRef = useRef<Map<string, boolean>>(new Map());
    const isValidatingRef = useRef(false);
    // Track the last slug we set an error for to prevent duplicate error setting
    const lastErrorSetRef = useRef<string | null>(null);
    const debouncedSlug = useDebounce(slug, 500);

    const validateFormat = useCallback((value: string): boolean => {
        return /^[a-zA-Z0-9-]+$/.test(value);
    }, []);

    // Reset validation when slug matches the original
    useEffect(() => {
        if (debouncedSlug === originalSlug) {
            setValidationState({ status: "idle" });
        }
    }, [debouncedSlug, originalSlug]);

    // Validate slug, with optimizations to prevent loops
    useEffect(() => {
        if (!debouncedSlug) {
            setValidationState({ status: "idle" });
            return;
        }

        // Skip validation if slug matches original
        if (debouncedSlug === originalSlug) {
            return;
        }

        // Reset error tracking if the slug has changed
        if (lastErrorSetRef.current !== debouncedSlug) {
            lastErrorSetRef.current = null;
        }

        // Validate format first
        if (!validateFormat(debouncedSlug)) {
            setValidationState({
                status: "invalid",
                message: "Slug can only contain letters, numbers, and hyphens",
            });
            return;
        }

        // Check cache for previously validated slugs
        if (validatedSlugsRef.current.has(debouncedSlug)) {
            const isValid = validatedSlugsRef.current.get(debouncedSlug);
            setValidationState({
                status: isValid ? "valid" : "invalid",
                message: isValid ? undefined : "This slug is already in use",
            });
            return;
        }

        // Guard against concurrent API calls
        if (isValidatingRef.current) {
            return;
        }

        const checkSlugAvailability = async () => {
            isValidatingRef.current = true;
            setValidationState({ status: "checking" });

            try {
                const response = await fetch(
                    `/api/podcasts/check-slug?slug=${encodeURIComponent(debouncedSlug)}`
                );
                const data = await response.json();

                // Cache the result
                const isAvailable = data.available;
                validatedSlugsRef.current.set(debouncedSlug, isAvailable);

                // Only update state if this is still the current slug
                if (debouncedSlug === slug) {
                    setValidationState({
                        status: isAvailable ? "valid" : "invalid",
                        message: isAvailable ? undefined : "This slug is already in use",
                    });
                }
            } catch (error) {
                console.error("Error checking slug:", error);
                setValidationState({ status: "idle" });
            } finally {
                isValidatingRef.current = false;
            }
        };

        checkSlugAvailability();
    }, [debouncedSlug, originalSlug, slug, validateFormat]);

    // Clear validation cache when autogenerating slug is enabled/disabled
    useEffect(() => {
        validatedSlugsRef.current = new Map();
        lastErrorSetRef.current = null;
    }, [isGeneratingSlug]);

    // Modified function to handle form errors without causing infinite loops
    const shouldSetFormError = useCallback((currentSlug: string): boolean => {
        // Always show validation state, but only set form error once per slug
        if (validationState.status !== "invalid") return false;
        
        // If we've already set a form error for this specific slug, don't trigger another form update
        if (lastErrorSetRef.current === currentSlug) return false;
        
        // Record that we've set an error for this slug
        lastErrorSetRef.current = currentSlug;
        return true;
    }, [validationState.status]);

    return {
        validationState,
        isValidFormat: validateFormat(slug),
        shouldSetFormError: () => shouldSetFormError(slug),
        clearValidation: useCallback(() => {
            validatedSlugsRef.current = new Map();
            lastErrorSetRef.current = null;
            setValidationState({ status: "idle" });
        }, []),
    };
}
