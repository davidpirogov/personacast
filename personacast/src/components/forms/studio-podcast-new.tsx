"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Podcast } from "@/types/database";
import { PodcastForm } from "./podcast-form";

export function NewPodcastForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    const defaultPodcast = searchParams.get("podcast")
        ? decodeURIComponent(searchParams.get("podcast")!)
        : undefined;

    const handleSubmit = async (podcast: Pick<Podcast, "title" | "description">) => {
        setError(null);
        const res = await fetch("/api/podcasts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(podcast),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.details || data.error || "Failed to create record");
        }

        router.push(`/studio/podcasts/${data.id}`);
        router.refresh();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Podcast</h1>
            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                    role="alert"
                >
                    <p>{error}</p>
                </div>
            )}
            <PodcastForm onSubmit={handleSubmit} />
        </div>
    );
}
