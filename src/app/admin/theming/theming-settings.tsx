"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheming } from "./context/theming-context";

const ThemingPreviewSettingsPanel = () => {
    const { settings, updateSettings } = useTheming();
    const [title, setTitle] = useState(settings.title);

    // Handle title change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        updateSettings({ title: newTitle });
    };

    return (
        <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Configuration</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input id="site-title" value={title} onChange={handleTitleChange} className="mt-1" />
                </div>
                <div>
                    <Label className="block text-sm font-medium text-gray-600">Colors</Label>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: settings.colors.primary.hex }}
                            />
                            <span className="text-sm">Primary: {settings.colors.primary.hex}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: settings.colors.secondary.hex }}
                            />
                            <span className="text-sm">Secondary: {settings.colors.secondary.hex}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: settings.colors.accent.hex }}
                            />
                            <span className="text-sm">Accent: {settings.colors.accent.hex}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemingPreviewSettingsPanel;
