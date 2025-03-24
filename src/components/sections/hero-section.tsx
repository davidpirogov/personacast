"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SiteSettings } from "@/app/admin/theming/defaults";

interface HeroSectionProps {
    className?: string;
    settings?: SiteSettings;
}

export function HeroSection({ className, settings }: HeroSectionProps) {
    const [scrollY, setScrollY] = useState(0);

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
        return settings.hero.images.map((img) => `${img.paths[format]} ${img.width}w`).join(", ");
    };

    const hasHeroImage = settings?.hero.images && settings.hero.images.length > 0;
    const mainImageSrc = hasHeroImage ? settings.hero.images[0].paths.webp : null;
    const hasPlaceholder = settings?.hero.placeholder ? true : false;

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
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{ y: scrollY * 0.5 }}
                >
                    {/* Optimized image with blur placeholder */}
                    <Image
                        src={mainImageSrc}
                        alt="Hero background"
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                        quality={90}
                        placeholder={hasPlaceholder ? "blur" : "empty"}
                        blurDataURL={settings?.hero.placeholder || undefined}
                        {...{
                            srcSet: generateSrcSet("webp"),
                        }}
                    />
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
