import Script from "next/script";
import { SiteSettings } from "@/app/admin/theming/defaults";
import { selectBestHeroImage } from "@/lib/shared-image-utils";

interface HeadResourceHintsProps {
    settings: SiteSettings;
}

export function HeadResourceHints({ settings }: HeadResourceHintsProps) {
    // Only generate hints if we have hero images
    if (!settings?.hero?.images?.length) {
        return null;
    }

    // Extract unique domains from image URLs to set up preconnect
    const imageUrls = settings.hero.images.map((img) => img.paths.webp);
    const domains = [
        ...new Set(
            imageUrls.map((url) => {
                try {
                    return new URL(url).hostname;
                } catch (e) {
                    return null;
                }
            }),
        ),
    ].filter(Boolean);

    // Use the shared utility to select the best image
    const mainImage = selectBestHeroImage(settings.hero.images);
    const placeholderImage = settings.hero.placeholder;

    // Generate inline script to preload images efficiently
    const inlineScript = `
    (function() {
      // Helper function to preload an image
      function preloadImage(src) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      }

      // Preload main images after page load
      window.addEventListener('load', function() {
        // Start with placeholder for quick display
        ${placeholderImage ? `preloadImage("${placeholderImage}");` : ""}
        
        // Then load main image
        ${mainImage ? `preloadImage("${mainImage}");` : ""}
      });
    })();
  `;

    return (
        <>
            {/* Domain preconnect hints */}
            {domains.map(
                (domain, i) =>
                    domain && (
                        <link
                            key={`preconnect-${i}`}
                            rel="preconnect"
                            href={`https://${domain}`}
                            crossOrigin="anonymous"
                        />
                    ),
            )}

            {/* Critical image preloads */}
            {placeholderImage && (
                <link
                    rel="preload"
                    as="image"
                    href={placeholderImage}
                    type="image/webp"
                    fetchPriority="high"
                />
            )}
            {mainImage && mainImage !== placeholderImage && (
                <link rel="preload" as="image" href={mainImage} type="image/webp" fetchPriority="high" />
            )}

            {/* Inline script for advanced image loading */}
            <Script id="image-preloader" strategy="afterInteractive">
                {inlineScript}
            </Script>
        </>
    );
}
