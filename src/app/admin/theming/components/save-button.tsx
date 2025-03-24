"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useLandingPage } from "../context/landing-page-context";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
    compact?: boolean;
}

export function SaveButton({ compact = false }: SaveButtonProps) {
    const { isDirty, isLoading, error, saveChanges } = useLandingPage();
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const prevErrorRef = useRef<string | null>(null);

    // Only show the error toast when the error changes
    useEffect(() => {
        if (error && error !== prevErrorRef.current) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error,
                duration: 5000,
            });
            prevErrorRef.current = error;
        } else if (!error) {
            prevErrorRef.current = null;
        }
    }, [error, toast]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveChanges();
            toast({
                title: "Success",
                description: "Settings saved successfully!",
                duration: 3000,
            });
        } catch (err) {
            // If there's an error that wasn't caught by the landing page context
            if (!error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to save settings",
                    duration: 5000,
                });
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Common button style for both variants
    const buttonStyle = cn(
        "flex items-center gap-2",
        isDirty && !isSaving && !isLoading && "bg-black text-white hover:bg-black/90",
    );

    if (compact) {
        return (
            <Button
                onClick={handleSave}
                disabled={!isDirty || isSaving || isLoading}
                size="sm"
                className={buttonStyle}
            >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                Save Changes
            </Button>
        );
    }

    return (
        <div className="mt-6">
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={!isDirty || isSaving || isLoading}
                    className={buttonStyle}
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
