"use client";

import { useState, useEffect } from "react";
import { SiteSettings } from "./defaults";
import ThemingPreviewImagePanel from "./hero-image-mgmt";
import ThemingPreviewSettingsPanel from "./theming-settings";
import { Button } from "@/components/ui/button";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { ThemingProvider, useTheming } from "./context/theming-context";
import { useThemingImage, ThemingImageProvider } from "./context/theming-image-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ThemingPreviewContent() {
    const { isDirty, isLoading, error, saveChanges, updateHeroImage, updateSettings, settings } =
        useTheming();
    const { type, uploadedImage, optimizedImages } = useThemingImage();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // When optimized images are available, update the hero image in the parent context
    useEffect(() => {
        if (optimizedImages.length > 0 && type !== "default") {
            // Get the path from the first optimized image
            const path = optimizedImages[0].paths.webp;

            // Extract file ID properly from API URL
            // Format: /api/files/optimized/{fileId}/hero/{size}.{extension}
            const matches = path.match(/\/api\/files\/optimized\/([^\/]+)\/hero\//);
            const fileId = matches ? matches[1] : "";

            if (!fileId) {
                console.error("Could not extract fileId from path:", path);
                return;
            }

            // Update the complete hero object in settings
            updateSettings({
                hero: {
                    fileId,
                    id: settings.hero.id, // Keep the existing ID
                    images: optimizedImages,
                    placeholder:
                        optimizedImages.find((img) => img.size === "placeholder")?.paths.webp || null,
                },
            });
        }
    }, [optimizedImages, type, updateSettings, settings]);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveChanges();
            setShowSuccess(true);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ThemingPreviewSettingsPanel />
                <ThemingPreviewImagePanel />
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {showSuccess && (
                <Alert className="mt-4 bg-green-50 border-green-200 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Settings saved successfully!</AlertDescription>
                </Alert>
            )}

            <div className="mt-6 flex justify-end">
                {/* Debug state info */}
                <div className="mr-4 text-xs text-gray-500">
                    isDirty: {isDirty ? "true" : "false"}, isSaving: {isSaving ? "true" : "false"}, isLoading:{" "}
                    {isLoading ? "true" : "false"}
                </div>

                <Button
                    onClick={handleSave}
                    disabled={!isDirty || isSaving || isLoading}
                    className="flex items-center gap-2"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </Button>
            </div>
        </>
    );
}

export default function ThemingPreview({ settings }: { settings: SiteSettings }) {
    return (
        <ThemingProvider initialSettings={settings}>
            <ThemingImageProvider>
                <ThemingPreviewContent />
            </ThemingImageProvider>
        </ThemingProvider>
    );
}
