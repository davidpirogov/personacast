"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SiteSettings } from "@/app/admin/theming/defaults";
import { selectBestHeroImage } from "@/lib/shared-image-utils";

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
    // Add image ref to access image properties
    const imageRef = useRef<HTMLImageElement>(null);
    const [scrollY, setScrollY] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Debug state
    const [debugInfo, setDebugInfo] = useState<ImageDebugInfo | null>(null);
    const [showDebug, setShowDebug] = useState(false);
    const [showDebugControls, setShowDebugControls] = useState(false);

    // Get viewport info for client-side image selection
    const [viewportInfo, setViewportInfo] = useState<{ width: number; dpr: number } | null>(null);

    // Set up viewport info on mount and check for debug controls
    useEffect(() => {
        setViewportInfo({
            width: window.innerWidth,
            dpr: window.devicePixelRatio || 1,
        });

        // Check for debug controls - only on client side
        setShowDebugControls(process.env.NEXT_PUBLIC_APP_SHOW_DEBUG_CONTROLS === "true");

        // Update on resize for responsive behavior
        const handleResize = () => {
            setViewportInfo({
                width: window.innerWidth,
                dpr: window.devicePixelRatio || 1,
            });
        };

        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle scroll for parallax effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Use our shared utility with viewport info
    const hasHeroImage = settings?.hero.images && settings.hero.images.length > 0;
    const mainImageSrc = hasHeroImage ? selectBestHeroImage(settings.hero.images, viewportInfo) : null;
    const hasPlaceholder = settings?.hero.placeholder ? true : false;

    // Generate srcSet for optimized images - use only if we have multiple appropriate sizes
    const generateSrcSet = (format: "webp" | "jpeg") => {
        if (!settings?.hero.images || settings.hero.images.length === 0) return "";
        const srcSet = settings.hero.images.map((img) => `${img.paths[format]} ${img.width}w`).join(", ");
        return srcSet;
    };

    // Handle image load with dimensions
    const handleImageLoad = () => {
        setImageLoaded(true);

        // Access the image element via ref or querySelector
        const imgElement =
            imageRef.current || (document.querySelector(".hero-background-image") as HTMLImageElement);
        if (!imgElement) return;

        // Get image dimensions
        const naturalWidth = imgElement.naturalWidth;
        const naturalHeight = imgElement.naturalHeight;

        // Get the currently selected image size based on the dimensions
        let selectedSize = "unknown";
        let closestMatch = null;
        let closestDiff = Infinity;

        if (settings?.hero.images) {
            // First try to find exact match
            const exactMatch = settings.hero.images.find((image) => image.width === naturalWidth);

            if (exactMatch) {
                selectedSize = exactMatch.size;
            } else {
                // If no exact match, find the closest match by width
                settings.hero.images.forEach((image) => {
                    const diff = Math.abs(image.width - naturalWidth);
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

        // Get viewport dimensions for context
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        setDebugInfo({
            src: imgElement.src,
            naturalWidth,
            naturalHeight,
            currentSrc: imgElement.currentSrc || "unknown",
            size: selectedSize,
            viewport: `${viewportWidth}x${viewportHeight}`,
            dpr: window.devicePixelRatio,
        });
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
            {mainImageSrc && (
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ y: scrollY * 0.5 }}
                >
                    {/* Optimized image with blur placeholder */}
                    <Image
                        ref={imageRef}
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

            {/* Debug Overlay Button - only rendered client-side */}
            {showDebugControls && (
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
