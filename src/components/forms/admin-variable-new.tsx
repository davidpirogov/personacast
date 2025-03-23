"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VariableForm } from "./variable-form";
import { toast } from "sonner";
import { type VariableFormData } from "@/schemas/variables";

export function NewVariableForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: VariableFormData) => {
        try {
            setError(null);
            const res = await fetch("/api/variables", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const responseData = await res.json();
                throw new Error(responseData.details || responseData.error || "Failed to create variable");
            }

            const responseData = await res.json();
            toast.success(`Variable '${data.name}' created successfully`);
            router.push(`/admin/variables`);
            router.refresh();
        } catch (err) {
            console.error("Error creating variable:", err);
            const message = err instanceof Error ? err.message : "Failed to create variable";
            setError(message);
            toast.error(message);
            throw err;
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Create New Variable</h1>
            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                    role="alert"
                >
                    <p>{error}</p>
                </div>
            )}
            <VariableForm onSubmit={handleSubmit} submitLabel="Create Variable" />
        </div>
    );
}
