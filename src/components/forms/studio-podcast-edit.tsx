"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PodcastForm } from "./podcast-form";
import { toast } from "sonner";
import { type Podcast } from "@/types/database";
import { type PodcastUpdateRequest } from "@/schemas/podcasts/schema";

interface EditPodcastFormProps {
    podcast: Podcast;
}

export function EditPodcastForm({ podcast }: EditPodcastFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: PodcastUpdateRequest) => {
        try {
            setError(null);
            const res = await fetch(`/api/podcasts/${podcast.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const responseData = await res.json();
                throw new Error(responseData.details || responseData.error || "Failed to update podcast");
            }

            const responseData = await res.json();
            toast.success(`Podcast '${data.title || podcast.title}' updated successfully`);
            router.push(`/studio/podcasts/${responseData.slug}`);
            router.refresh();
        } catch (err) {
            console.error("Error updating podcast:", err);
            const message = err instanceof Error ? err.message : "Failed to update podcast";
            setError(message);
            toast.error(message);
            throw err; // Re-throw to let the form component handle the error state
        }
    };

    return (
        <div className="container py-4 max-w-2xl">
            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                    role="alert"
                >
                    <p>{error}</p>
                </div>
            )}
            <PodcastForm podcast={podcast} onSubmit={handleSubmit} />
        </div>
    );
}
