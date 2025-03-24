"use client";

import { useLandingPage } from "../context/landing-page-context";
import { SaveButton } from "./save-button";
import { cn } from "@/lib/utils";

interface PageTitleWithSaveProps {
    title: string;
}

export function PageTitleWithSave({ title }: PageTitleWithSaveProps) {
    const { isDirty } = useLandingPage();

    return (
        <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl">
                <span className="font-light">{title}</span>
                {isDirty && (
                    <span className="ml-2 text-orange-500 italic font-normal text-lg">
                        (Unsaved changes)
                    </span>
                )}
            </h1>
            
            {isDirty && (
                <div className="hidden md:block">
                    <SaveButton compact />
                </div>
            )}
        </div>
    );
} 