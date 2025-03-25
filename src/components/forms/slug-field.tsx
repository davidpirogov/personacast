"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormState } from "@/contexts/form-context";
import { useSlugValidation } from "@/hooks/use-slug-validation";

interface SlugFieldProps {
    // Empty props as they'll come from context
}

export function SlugField({}: SlugFieldProps) {
    const { titleValue, originalSlug, isGeneratingSlug, setIsGeneratingSlug } = useFormState();
    const form = useFormContext();
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const prevTitleRef = useRef<string>(titleValue);
    const errorMessageSetRef = useRef<boolean>(false);

    const slugValue = form.watch("slug") as string;

    const { validationState, clearValidation, shouldSetFormError } = useSlugValidation({
        slug: slugValue,
        originalSlug,
        isGeneratingSlug,
    });

    // Function to convert title to slug format
    const generateSlugFromTitle = useCallback((title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, "-")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/-$/, "")
            .trim();
    }, []);

    // Auto-generate slug from title when title changes (if in auto mode)
    useEffect(() => {
        // Only update if the title has actually changed
        if (isGeneratingSlug && titleValue && titleValue !== prevTitleRef.current) {
            prevTitleRef.current = titleValue;
            const newSlug = generateSlugFromTitle(titleValue);
            if (newSlug !== slugValue) {
                form.setValue("slug", newSlug, { shouldValidate: true });
                clearValidation();
                errorMessageSetRef.current = false;
            }
        }
    }, [titleValue, isGeneratingSlug, form, slugValue, clearValidation, generateSlugFromTitle]);

    // Focus input when switching to edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    // Handle form errors - only set once per invalid state
    useEffect(() => {
        // Handle invalid state
        if (validationState.status === "invalid") {
            // Only set form error once per validation state change
            if (shouldSetFormError()) {
                form.setError("slug", {
                    type: "validate",
                    message: validationState.message || "Invalid slug",
                });
                errorMessageSetRef.current = true;
            }
        }
        // Handle valid state
        else if (validationState.status === "valid") {
            if (form.formState.errors.slug) {
                form.clearErrors("slug");
                errorMessageSetRef.current = false;
            }
        }
    }, [validationState, form, shouldSetFormError]);

    // When slug changes, we should clear errors
    useEffect(() => {
        if (form.formState.errors.slug) {
            // Clear errors when slug changes
            form.clearErrors("slug");
            errorMessageSetRef.current = false;
        }
    }, [slugValue, form]);

    const handleStartEditing = () => {
        setIsEditing(true);
        setIsGeneratingSlug(false);
    };

    // Handle manual changes to the slug field
    const handleSlugChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
            onChange(e);
            // Clear errors when user types a new value
            if (form.formState.errors.slug) {
                form.clearErrors("slug");
                errorMessageSetRef.current = false;
            }
        },
        [form],
    );

    return (
        <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <div className="relative">
                        {!isEditing ? (
                            <div
                                className={cn(
                                    "flex items-center border border-dashed rounded-md px-3 py-2 h-9 cursor-pointer hover:bg-gray-50",
                                    validationState.status === "valid"
                                        ? "border-green-500"
                                        : "border-gray-200",
                                    validationState.status === "invalid" && "border-red-500",
                                )}
                                onClick={handleStartEditing}
                            >
                                <span className="text-gray-700 flex-1 text-sm">
                                    {field.value || "Auto-generated from title"}
                                </span>
                                <div className="flex items-center">
                                    {validationState.status === "checking" && (
                                        <span className="h-4 w-4 block rounded-full border-2 border-t-transparent border-gray-500 animate-spin mr-2" />
                                    )}
                                    {validationState.status === "valid" && (
                                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                                    )}
                                    {validationState.status === "invalid" && (
                                        <XIcon className="h-4 w-4 text-red-500 mr-2" />
                                    )}
                                    <PencilIcon className="h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                        ) : (
                            <FormControl>
                                <div className="flex items-center">
                                    <Input
                                        {...field}
                                        ref={inputRef}
                                        placeholder="podcast-slug"
                                        className={cn(
                                            "pr-8",
                                            validationState.status === "valid" && "border-green-500",
                                            validationState.status === "invalid" && "border-red-500",
                                        )}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!e.target.value) {
                                                setIsGeneratingSlug(true);
                                                setIsEditing(false);
                                            }
                                        }}
                                        onChange={(e) => handleSlugChange(e, field.onChange)}
                                    />
                                    <div className="absolute right-3">
                                        {validationState.status === "checking" && (
                                            <span className="h-4 w-4 block rounded-full border-2 border-t-transparent border-gray-500 animate-spin" />
                                        )}
                                        {validationState.status === "valid" && (
                                            <CheckIcon className="h-4 w-4 text-green-500" />
                                        )}
                                        {validationState.status === "invalid" && (
                                            <XIcon className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            </FormControl>
                        )}
                    </div>
                    {/* Message container with fixed height to prevent layout shifts */}
                    <div className="h-6 mt-1.5 relative">
                        {validationState.status === "invalid" ? (
                            <FormMessage className="absolute top-0 left-0 text-xs">
                                {validationState.message}
                            </FormMessage>
                        ) : isGeneratingSlug && !isEditing ? (
                            <p className="absolute top-0 left-0 text-xs text-gray-500">
                                Auto-generated from title. Click to edit.
                            </p>
                        ) : null}
                    </div>
                </FormItem>
            )}
        />
    );
}
