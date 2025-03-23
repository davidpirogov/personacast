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
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.details || responseData.error || "Failed to update podcast");
            }

            toast.success("Podcast updated successfully");
            router.push(`/studio/podcasts/${podcast.id}`);
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update podcast";
            setError(message);
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Edit Podcast</h1>
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
