import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemingImage } from "../context/theming-image-context";
import { useTheming } from "../context/theming-context";
import { cn } from "@/lib/utils";

export function ThemingPreviewImagePanel() {
    const { type, previewUrl, optimizedImages } = useThemingImage();
    const { settings } = useTheming();

    // Determine which image URL to display
    const imageUrl =
        optimizedImages.length > 0
            ? optimizedImages[0]?.paths.webp
            : previewUrl ||
              (settings.hero.images.length > 0
                  ? settings.hero.images[0].paths.webp
                  : settings.hero.placeholder);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Hero Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={imageUrl}
                                alt="Hero preview"
                                fill
                                className={cn("object-cover")}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
