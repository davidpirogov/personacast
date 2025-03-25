import { Suspense } from "react";
import { Metadata } from "next";
import GeneralPageSection, { GeneralPageSectionSkeleton } from "@/components/sections/general-page-section";
import { podcastService } from "@/services/podcast-service";
import { EpisodeList } from "./episode-list";
import { PodcastOverview } from "./podcast-overview";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Podcast | Studio",
};

interface PodcastSectionProps {
    podcastSlug: string;
}

const PodcastSection = async ({ podcastSlug }: PodcastSectionProps) => {
    
    const podcast = await podcastService.getPodcastBySlug(podcastSlug);


    const allPodcasts = await podcastService.list();

    console.log(allPodcasts);


    if (!podcast) {
        notFound();
    }

    return (
        <GeneralPageSection title={podcast.title} description={podcast.description}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <PodcastOverview podcast={podcast} />
                </div>
                <div>
                    <EpisodeList podcast={podcast} />
                </div>
            </div>
        </GeneralPageSection>
    );
};

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function PodcastPage({ params }: PageProps) {
    const resolvedParams = await params;
    const podcastSlug = resolvedParams.slug;

    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<GeneralPageSectionSkeleton />}>
                <PodcastSection podcastSlug={podcastSlug} />
            </Suspense>
        </main>
    );
}
