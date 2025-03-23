"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Podcast } from "@/types/database";
import { podcastCreateRequestSchema, podcastUpdateRequestSchema } from "@/schemas/podcasts/schema";
import * as z from "zod";

// Use the create schema for the form since it has all required fields
const formSchema = podcastCreateRequestSchema;
type FormData = z.infer<typeof formSchema>;

interface PodcastFormProps {
    podcast?: Podcast;
    onSubmit: (data: FormData) => Promise<void>;
}

export function PodcastForm({ podcast, onSubmit }: PodcastFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: podcast?.title || "",
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {form.formState.errors.root && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>{form.formState.errors.root.message}</p>
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="My Amazing Podcast" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us about your podcast..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                            form.setValue('publishedAt', new Date());
                                        } else {
                                            form.setValue('publishedAt', null);
                                        }
                                    }}
                                    aria-label="Published"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
            </form>
        </Form>
    );
}
