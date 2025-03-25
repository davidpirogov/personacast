import { Suspense } from "react";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import GeneralPageSection from "@/components/sections/general-page-section";
import { heroImagesService } from "@/services/hero-images-service";
import { HeroImagesTable } from "@/components/data-tables/hero-images-table";

export const metadata: Metadata = {
    title: "Hero Images | Admin",
};

const HeroImagesList = async () => {
    const heroImages = await heroImagesService.list();

    return (
        <GeneralPageSection title="Hero Images" description="Manage your hero images">
            <HeroImagesTable heroImages={heroImages} />
        </GeneralPageSection>
    );
};

export default function HeroImagesPage() {
    return (
        <main className="container mx-auto mt-16 p-6">
            <Suspense fallback={<Loader />}>
                <HeroImagesList />
            </Suspense>
        </main>
    );
}
