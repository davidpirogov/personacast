"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Podcast } from "@/types/database";
import { podcastCreateRequestSchema, podcastUpdateRequestSchema } from "@/schemas/podcasts/schema";
import { SlugField } from "./slug-field";
import { TitleField } from "./title-field";
import * as z from "zod";
import { FormProvider } from "@/contexts/form-context";
import { cn } from "@/lib/utils";
import { useDebugControls } from "@/lib/hooks/use-debug-controls";

// Use different schema depending on whether we're creating or updating
interface PodcastFormProps {
    podcast?: Podcast;
    hidePublishedFields?: boolean;
    onSubmit: (data: any) => Promise<void>;
}

export function PodcastForm({ podcast, onSubmit, hidePublishedFields = false }: PodcastFormProps) {
    // Use the appropriate schema based on whether we're creating or updating
    const formSchema = podcast ? podcastUpdateRequestSchema : podcastCreateRequestSchema;
    type FormData = z.infer<typeof formSchema>;

    // Get debug controls state
    const { showDebugControls } = useDebugControls();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: podcast?.title || "",
            slug: podcast?.slug || "",
            description: podcast?.description || "",
            published: podcast?.published || false,
            publishedAt: podcast?.publishedAt || null,
        },
    });

    const handleSubmit = async (data: FormData) => {
        console.log("Form submitted with data:", data);
        try {
            await onSubmit(data);
            form.reset(data); // Reset form with new data after successful submission
        } catch (error) {
            console.error("Error submitting form:", error);
            // Set form error
            form.setError("root", {
                type: "manual",
                message: error instanceof Error ? error.message : "Failed to submit form",
            });
        }
    };

    return (
        <FormProvider initialTitle={podcast?.title || ""} originalSlug={podcast?.slug}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {form.formState.errors.root && (
                        <div className="bg-red-100 border border-red-400 text-red-700 py-3 rounded">
                            <p>{form.formState.errors.root.message}</p>
                        </div>
                    )}

                    <TitleField />

                    <SlugField />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your podcast..."
                                        className={cn("min-h-[100px]", fieldState.error && "border-red-500")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!hidePublishedFields ? (
                        <FormField
                            control={form.control}
                            name="published"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Published</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                                if (checked) {
                                                    form.setValue("publishedAt", new Date());
                                                } else {
                                                    form.setValue("publishedAt", null);
                                                }
                                            }}
                                            aria-label="Published"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <input type="hidden" {...form.register("published")} value="false" />
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? "Saving..."
                            : podcast
                              ? "Update Podcast"
                              : "Create Podcast"}
                    </button>

                    {/* Debug form state - only shown to admin users when enabled */}
                    {showDebugControls && (
                        <div className="text-xs text-gray-500 mt-4">
                            <p>Form State:</p>
                            <pre>
                                {JSON.stringify(
                                    {
                                        isDirty: form.formState.isDirty,
                                        isSubmitting: form.formState.isSubmitting,
                                        isValid: form.formState.isValid,
                                        errors: form.formState.errors,
                                        values: form.getValues(),
                                    },
                                    null,
                                    2,
                                )}
                            </pre>
                        </div>
                    )}
                </form>
            </Form>
        </FormProvider>
    );
}
