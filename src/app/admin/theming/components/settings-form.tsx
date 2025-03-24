"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLandingPage } from "../context/landing-page-context";

export function SettingsForm() {
    const { settings, updateSettings } = useLandingPage();

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Site Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Site Title</Label>
                    <Input
                        id="title"
                        type="text"
                        value={settings.title}
                        onChange={(e) => updateSettings({ title: e.target.value })}
                        placeholder="Enter site title"
                    />
                </div>

                {/* Primary Color */}
                <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="primaryColor"
                            type="color"
                            value={settings.colors.primary.hex}
                            onChange={(e) =>
                                updateSettings({
                                    colors: {
                                        ...settings.colors,
                                        primary: {
                                            ...settings.colors.primary,
                                            hex: e.target.value,
                                        },
                                    },
                                })
                            }
                            className="w-16 h-10 p-1"
                        />
                        <Input
                            type="text"
                            value={settings.colors.primary.hex}
                            onChange={(e) =>
                                updateSettings({
                                    colors: {
                                        ...settings.colors,
                                        primary: {
                                            ...settings.colors.primary,
                                            hex: e.target.value,
                                        },
                                    },
                                })
                            }
                            placeholder="#000000"
                            className="font-mono"
                        />
                    </div>
                </div>

                {/* Secondary Color */}
                <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="secondaryColor"
                            type="color"
                            value={settings.colors.secondary.hex}
                            onChange={(e) =>
                                updateSettings({
                                    colors: {
                                        ...settings.colors,
                                        secondary: {
                                            ...settings.colors.secondary,
                                            hex: e.target.value,
                                        },
                                    },
                                })
                            }
                            className="w-16 h-10 p-1"
                        />
                        <Input
                            type="text"
                            value={settings.colors.secondary.hex}
                            onChange={(e) =>
                                updateSettings({
                                    colors: {
                                        ...settings.colors,
                                        secondary: {
                                            ...settings.colors.secondary,
                                            hex: e.target.value,
                                        },
                                    },
                                })
                            }
                            placeholder="#000000"
                            className="font-mono"
                        />
                    </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="accentColor"
                            type="color"
                            value={settings.colors.accent.hex}
                            onChange={(e) =>
                                updateSettings({
                                    colors: {
                                        ...settings.colors,
                                        accent: {
                                            ...settings.colors.accent,
                                            hex: e.target.value,
                                        },
                                    },
                                })
                            }
                            className="w-16 h-10 p-1"
                        />
                        <Input
                            type="text"
                            value={settings.colors.accent.hex}
                            onChange={(e) =>
                                updateSettings({
                                    colors: {
                                        ...settings.colors,
                                        accent: {
                                            ...settings.colors.accent,
                                            hex: e.target.value,
                                        },
                                    },
                                })
                            }
                            placeholder="#000000"
                            className="font-mono"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 