"use client";

import { HeroImagePreview } from "./components/hero-image-preview";
import { SettingsForm } from "./components/settings-form";
import { ImageUploadControls } from "./components/image-upload-controls";
import { SaveButton } from "./components/save-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LandingPageContent() {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left side: Settings Form */}
                <SettingsForm />
                
                {/* Right side: Hero Image and Controls */}
                <div className="space-y-4">
                    <HeroImagePreview />
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ImageUploadControls />
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            {/* Save Button at bottom */}
            <SaveButton />
        </>
    );
} 