"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VariableForm } from "./variable-form";
import { toast } from "sonner";
import { type Variable } from "@/types/database";
import { type VariableFormData } from "@/schemas/variables";

interface EditVariableFormProps {
    variable: Variable;
}

export function EditVariableForm({ variable }: EditVariableFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: VariableFormData) => {
        try {
            setError(null);
            const res = await fetch(`/api/variables/${variable.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.details || responseData.error || "Failed to update variable");
            }

            toast.success("Variable updated successfully");
            router.push(`/admin/variables`);
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update variable";
            setError(message);
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Edit Variable</h1>
            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                    role="alert"
                >
                    <p>{error}</p>
                </div>
            )}
            <VariableForm initialData={variable} onSubmit={handleSubmit} submitLabel="Update Variable" />
        </div>
    );
}
