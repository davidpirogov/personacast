import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemingImage } from "../context/theming-image-context";
import { cn } from "@/lib/utils";
import { SiteSettings } from "../defaults";

export function ThemingPreviewImagePanel({ settings }: { settings: SiteSettings }) {
    const { type, url, previewUrl, optimizedImages } = useThemingImage();

    const imageUrl = optimizedImages[0]?.paths.webp || previewUrl || url;

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
                                className={cn("object-cover", type === "default" && "opacity-50")}
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
