import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

interface HeroSectionProps {
    className?: string;
}

interface OptimizedImage {
    size: string;
    width: number;
    paths: {
        webp: string;
        jpeg: string;
    };
}

export function HeroSection({ className }: HeroSectionProps) {
    const [heroImage, setHeroImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [scrollY, setScrollY] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [optimizedImages, setOptimizedImages] = useState<OptimizedImage[]>([]);
    const [placeholderDataUrl, setPlaceholderDataUrl] = useState<string | null>(null);

    // Handle scroll for parallax effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Cleanup preview URL when component unmounts or when optimized images are ready
    useEffect(() => {
        if (previewUrl && optimizedImages.length > 0) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl, optimizedImages]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError("Image size should be less than 10MB");
            return;
        }

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setHeroImage(file);
        setError(null);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload/hero", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await response.json();
            setOptimizedImages(data.images);
            setPlaceholderDataUrl(data.placeholder);
        } catch (err) {
            setError("Failed to save image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    // Generate srcSet for optimized images
    const generateSrcSet = (format: "webp" | "jpeg") => {
        return optimizedImages.map((img) => `${img.paths[format]} ${img.width}w`).join(", ");
    };

    return (
        <section
            className={cn(
                "relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden",
                "bg-gradient-to-b from-background/95 to-background/50",
                className,
            )}
        >
            {/* Hero Image with Parallax */}
            {(previewUrl || optimizedImages.length > 0) && (
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{ y: scrollY * 0.5 }}
                >
                    {optimizedImages.length > 0 ? (
                        // Optimized image with blur placeholder
                        <Image
                            src={optimizedImages[0].paths.webp}
                            alt="Hero background"
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                            quality={90}
                            placeholder="blur"
                            blurDataURL={placeholderDataUrl!}
                            {...{
                                srcSet: generateSrcSet("webp"),
                            }}
                        />
                    ) : (
                        // Preview image without blur placeholder
                        <Image
                            src={previewUrl!}
                            alt="Hero background"
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                            quality={90}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </motion.div>
            )}

            {/* Content with Animations */}
            <div className="relative z-10 container mx-auto px-4">
                <motion.div
                    className="max-w-4xl mx-auto text-center space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Welcome to Personacast
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Podcasts with AI persona twists
                    </motion.p>

                    {/* Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Card className="mt-8 bg-background/80 backdrop-blur-lg border-none">
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <Label htmlFor="hero-image" className="text-lg text-white">
                                        Upload Hero Image
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="hero-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="bg-background/50 border-white/20 text-white"
                                            disabled={isUploading}
                                        />
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                                                <Upload className="w-5 h-5 text-white animate-bounce" />
                                            </div>
                                        )}
                                    </div>
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}
                                    <p className="text-sm text-gray-300">
                                        Recommended size: 2560×1440px (2K) or 3840×2160px (4K). Max file size:
                                        10MB
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
