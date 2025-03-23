"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ThemingImageProvider } from "./context/theming-image-context";
import { ThemingPreviewImagePanel } from "./components/theming-preview-image-panel";
import { ThemingImageDropdownButton } from "./components/theming-image-dropdown-button";
import { ThemingLoadImageFromUrlPanel } from "./components/theming-load-image-from-url-panel";
import { useThemingImage } from "./context/theming-image-context";
import { SiteSettings } from "./defaults";

function HeroImageManagement({ settings }: { settings: SiteSettings }) {
    const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
    const { error } = useThemingImage();

    return (
        <div className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <ThemingPreviewImagePanel settings={settings} />

            <ThemingImageDropdownButton onUrlClick={() => setIsUrlDialogOpen(true)} />

            <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                <DialogContent className="sm:max-w-md flex flex-col gap-2 items-top">
                    <DialogTitle>Load Image from URL</DialogTitle>
                    <DialogDescription>
                        Enter the URL of an image to use as your hero image.
                    </DialogDescription>
                    <ThemingLoadImageFromUrlPanel onClose={() => setIsUrlDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function HeroImageManagementWithProvider({ settings }: { settings: SiteSettings }) {
    return (
        <ThemingImageProvider>
            <HeroImageManagement settings={settings} />
        </ThemingImageProvider>
    );
}
