"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemingImage } from "../context/theming-image-context";

interface ThemingLoadImageFromUrlPanelProps {
    onClose: () => void;
}

export function ThemingLoadImageFromUrlPanel({ onClose }: ThemingLoadImageFromUrlPanelProps) {
    const [url, setUrl] = useState("");
    const { onUrlSubmit, isLoading } = useThemingImage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onUrlSubmit(url);
        onClose();
    };

    return (
        <div className="w-full max-w-md mt-1 flex flex-col gap-2">
            <form onSubmit={handleSubmit}>
                <div className="py-4">
                    <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || !url.trim()}>
                        Load Image
                    </Button>
                </div>
            </form>
        </div>
    );
}
