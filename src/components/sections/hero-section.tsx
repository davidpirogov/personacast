"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SiteSettings } from "@/app/admin/theming/defaults";
import { DynamicHeroImage } from "@/components/layout/dynamic-hero-image";

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
    const [scrollY, setScrollY] = useState(0);

    // Debug state
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

    // Toggle debug info display
    const toggleDebug = () => {
        setShowDebug((prev) => !prev);
    };

    // Check if we have valid settings before rendering
    if (!settings) {
        return null;
    }

    return (
        <section
            className={cn(
                "relative min-h-[100vh] h-screen w-full flex items-center justify-center overflow-hidden",
                "bg-gradient-to-b from-background/95 to-background/50",
                className,
            )}
        >
            {/* Hero Image with Parallax */}
            <motion.div
                className="absolute inset-0 z-0 h-full"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ y: scrollY * 0.5 }}
            >
                {/* Use DynamicHeroImage component */}
                <DynamicHeroImage
                    siteSettings={settings}
                    className="hero-background-image h-full object-cover"
                    priority={true}
                />

                <div
                    className={cn(
                        "absolute inset-0 backdrop-blur-[0px]",
                        "bg-black/50",
                        "transition-opacity duration-1000",
                        "opacity-100", // Always visible
                    )}
                />
            </motion.div>

            {/* Debug Overlay Button - only rendered client-side */}
            {showDebugControls && (
                <button
                    onClick={toggleDebug}
                    className="absolute top-4 right-4 z-50 bg-black/70 text-white px-3 py-1 rounded text-sm"
                >
                    {showDebug ? "Hide Debug" : "Show Debug"}
                </button>
            )}

            {/* Content area */}
            <div className="relative z-10 container mx-auto px-4 py-16 text-center text-white">
                <motion.h1
                    className="text-5xl font-bold mb-6 md:text-6xl lg:text-7xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {settings.title}
                </motion.h1>

                <motion.p
                    className="text-xl mb-8 md:text-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {settings.description}
                </motion.p>
            </div>
        </section>
    );
}
