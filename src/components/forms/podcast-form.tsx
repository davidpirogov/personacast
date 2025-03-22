"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Podcast } from "@/types/database";

interface PodcastFormProps {
    initialData?: Podcast;
    onSubmit: (podcast: Pick<Podcast, "title" | "description">) => void;
}

export function PodcastForm({ initialData, onSubmit }: PodcastFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationErrors({});
        onSubmit({ title, description });
    };

    return (
        <div className="container mx-auto py-0">
            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        className={`w-full border p-2 rounded ${validationErrors.title ? "border-red-500" : ""}`}
                        required
                        placeholder="My Podcast"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {validationErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                    )}
                </div>
            </form>
        </div>
    );
}
