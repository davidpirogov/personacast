"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SiteSettings } from "@/app/admin/theming/defaults";
import { findBestQualityImage } from "@/lib/image-utils";

interface HeroSectionProps {
    className?: string;
    settings?: SiteSettings;
}

interface ImageDebugInfo {
    src: string;
    naturalWidth: number;
    naturalHeight: number;
    currentSrc: string;
    size: string;
    viewport?: string;
    dpr?: number;
}

export function HeroSection({ className, settings }: HeroSectionProps) {
    const [scrollY, setScrollY] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isImagesPreloaded, setIsImagesPreloaded] = useState(false);
    // Debug state
    const [debugInfo, setDebugInfo] = useState<ImageDebugInfo | null>(null);
    const [showDebug, setShowDebug] = useState(false);

    // Preload images before rendering to avoid pop-in effect
    useEffect(() => {
        if (!settings?.hero.images || settings.hero.images.length === 0) {
            setIsImagesPreloaded(true);
            return;
        }

        // Find best quality image at component mount time
        const bestImage = findBestQualityImage(settings.hero.images, null, "2xl");

        if (!bestImage) {
            setIsImagesPreloaded(true);
            return;
        }

        // Debug log what image should be used
        console.log("Preloading best image:", bestImage);
        console.log("Available images:", settings.hero.images);

        // Preload the image
        const img = new window.Image(1, 1);
        img.onload = () => {
            setIsImagesPreloaded(true);
        };
        img.onerror = () => {
            // Even if it errors, we should still show something
            setIsImagesPreloaded(true);
        };
        img.src = bestImage;
    }, [settings?.hero.images]);

    // Handle scroll for parallax effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Generate srcSet for optimized images
    const generateSrcSet = (format: "webp" | "jpeg") => {
        if (!settings?.hero.images || settings.hero.images.length === 0) return "";
        const srcSet = settings.hero.images.map((img) => `${img.paths[format]} ${img.width}w`).join(", ");
        console.log(`Generated ${format} srcSet:`, srcSet);
        return srcSet;
    };

    const hasHeroImage = settings?.hero.images && settings.hero.images.length > 0;
    // Use findBestQualityImage to get the highest quality image
    const mainImageSrc = hasHeroImage ? findBestQualityImage(settings.hero.images, null, "2xl") : null;
    const hasPlaceholder = settings?.hero.placeholder ? true : false;

    // Handle image load complete
    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    // Handle image loading complete with dimensions
    const handleLoadingComplete = (img: { naturalWidth: number; naturalHeight: number }) => {
        setImageLoaded(true);

        // Get the currently selected image size based on the dimensions
        let selectedSize = "unknown";
        let closestMatch = null;
        let closestDiff = Infinity;

        if (settings?.hero.images) {
            // First try to find exact match
            const exactMatch = settings.hero.images.find((image) => image.width === img.naturalWidth);

            if (exactMatch) {
                selectedSize = exactMatch.size;
            } else {
                // If no exact match, find the closest match by width
                settings.hero.images.forEach((image) => {
                    const diff = Math.abs(image.width - img.naturalWidth);
                    if (diff < closestDiff) {
                        closestDiff = diff;
                        closestMatch = image;
                    }
                });

                if (closestMatch) {
                    // @ts-ignore
                    selectedSize = `~${closestMatch.size} (nearest)`;
                }
            }
        }

        // Use document.querySelector to find the actual image element
        // This is a workaround since Next.js Image doesn't directly expose the img element
        setTimeout(() => {
            const imgElement = document.querySelector(".hero-background-image") as HTMLImageElement;
            if (imgElement) {
                // Get viewport dimensions for context
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                setDebugInfo({
                    src: imgElement.src,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    currentSrc: imgElement.currentSrc || "unknown",
                    size: selectedSize,
                    viewport: `${viewportWidth}x${viewportHeight}`,
                    dpr: window.devicePixelRatio,
                });

                console.log("Image loaded with:", {
                    src: imgElement.src,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    currentSrc: imgElement.currentSrc || "unknown",
                    size: selectedSize,
                    viewport: `${viewportWidth}x${viewportHeight}`,
                    dpr: window.devicePixelRatio,
                });
            }
        }, 0);
    };

    // Toggle debug info display
    const toggleDebug = () => {
        setShowDebug((prev) => !prev);
    };

    return (
        <section
            className={cn(
                "relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden",
                "bg-gradient-to-b from-background/95 to-background/50",
                className,
            )}
        >
            {/* Hero Image with Parallax */}
            {mainImageSrc && isImagesPreloaded && (
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ y: scrollY * 0.5 }}
                >
                    {/* Optimized image with blur placeholder */}
                    <Image
                        src={mainImageSrc}
                        alt="Hero background"
                        fill
                        priority
                        className={cn(
                            "hero-background-image", // Add a class for querySelector
                            "object-cover",
                            "transition-opacity duration-1000",
                            imageLoaded ? "opacity-100" : "opacity-0",
                        )}
                        sizes="100vw"
                        quality={95}
                        placeholder={hasPlaceholder ? "blur" : "empty"}
                        blurDataURL={settings?.hero.placeholder || undefined}
                        onLoad={handleImageLoad}
                        onLoadingComplete={handleLoadingComplete}
                        {...{
                            srcSet: generateSrcSet("webp"),
                        }}
                    />
                    <div
                        className={cn(
                            "absolute inset-0 backdrop-blur-[0px]",
                            "bg-black/50",
                            "transition-opacity duration-1000",
                            imageLoaded ? "opacity-100" : "opacity-0",
                        )}
                    />
                </motion.div>
            )}

            {/* Debug Overlay Button */}
            {process.env.APP_SHOW_DEBUG_CONTROLS === "true" && (
                <button
                    onClick={toggleDebug}
                    className="absolute top-4 right-4 z-50 bg-black/70 text-white px-3 py-1 rounded text-sm"
                >
                    {showDebug ? "Hide Debug" : "Show Debug"}
                </button>
            )}

            {/* Debug Overlay */}
            {showDebug && debugInfo && (
                <div className="absolute top-12 right-4 z-50 bg-black/80 text-white p-4 rounded max-w-md text-sm overflow-auto">
                    <h3 className="font-bold mb-2">Image Debug Info</h3>
                    <dl className="grid grid-cols-2 gap-1">
                        <dt className="font-semibold">Size:</dt>
                        <dd>{debugInfo.size}</dd>

                        <dt className="font-semibold">Dimensions:</dt>
                        <dd>
                            {debugInfo.naturalWidth} × {debugInfo.naturalHeight}
                        </dd>

                        <dt className="font-semibold">Viewport:</dt>
                        <dd>
                            {window.innerWidth} × {window.innerHeight} (DPR: {window.devicePixelRatio})
                        </dd>

                        <dt className="font-semibold">src:</dt>
                        <dd className="truncate">{debugInfo.src}</dd>

                        <dt className="font-semibold">currentSrc:</dt>
                        <dd className="truncate">{debugInfo.currentSrc}</dd>
                    </dl>

                    <h3 className="font-bold mt-3 mb-2">Available Images:</h3>
                    <div className="max-h-40 overflow-y-auto">
                        {settings?.hero.images &&
                            settings.hero.images.map((img, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "mb-2 border-t border-gray-700 pt-1",
                                        debugInfo.size === img.size ? "bg-blue-900/50" : "",
                                    )}
                                >
                                    <p>
                                        <span className="font-semibold">Size:</span> {img.size}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Width:</span> {img.width}px
                                    </p>
                                    <p className="truncate">
                                        <span className="font-semibold">WebP:</span> {img.paths.webp}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
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
                        {settings?.title || "Welcome to Personacast"}
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Podcasts with AI persona twists
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
