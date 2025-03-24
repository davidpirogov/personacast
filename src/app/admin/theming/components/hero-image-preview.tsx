"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLandingPage } from "../context/landing-page-context";
import { findBestQualityImage } from "@/lib/image-utils";

export function HeroImagePreview() {
    const { settings, imageUpload } = useLandingPage();

    // Determine base image URL as fallback
    // Priority: preview URL > placeholder
    const fallbackImageUrl = imageUpload.previewUrl || settings.hero.placeholder;

    // Get the best quality image using the optimized helper function
    const bestQualityImageUrl =
        // Try images from current upload first
        findBestQualityImage(
            imageUpload.optimizedImages,
            // If no uploaded images, try existing hero images
            findBestQualityImage(settings.hero.images, fallbackImageUrl),
        );

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Hero Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {bestQualityImageUrl ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={bestQualityImageUrl}
                                alt="Hero preview"
                                fill
                                priority
                                quality={90}
                                className={cn("object-cover")}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                unoptimized={!!imageUpload.previewUrl && !imageUpload.optimizedImages.length}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Default Hero Image
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
