"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PodcastForm } from "./podcast-form";
import { toast } from "sonner";
import { type PodcastCreateRequest } from "@/schemas/podcasts/schema";

export function NewPodcastForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: PodcastCreateRequest) => {
        console.log("NewPodcastForm handleSubmit called with:", data);
        try {
            setError(null);
            const res = await fetch("/api/podcasts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const responseData = await res.json();
                throw new Error(responseData.details || responseData.error || "Failed to create podcast");
            }

            const responseData = await res.json();
            toast.success(`Podcast '${data.title}' created successfully`);
            router.push(`/studio/podcasts/${responseData.id}`);
            router.refresh();
        } catch (err) {
            console.error("Error creating podcast:", err);
            const message = err instanceof Error ? err.message : "Failed to create podcast";
            setError(message);
            toast.error(message);
            throw err; // Re-throw to let the form component handle the error state
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Create New Podcast</h1>
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
