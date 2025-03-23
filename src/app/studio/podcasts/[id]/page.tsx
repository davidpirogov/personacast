import { Suspense } from "react";
import { Metadata } from "next";
import GeneralPageSection, {
    GeneralPageSectionSkeleton,
} from "@/components/page-sections/general-page-section";
import { podcastService } from "@/services/podcast-service";
import { EpisodeList } from "./episode-list";
import { PodcastOverview } from "./podcast-overview";

export const metadata: Metadata = {
    title: "Podcast | Studio",
};

interface PodcastSectionProps {
    podcastId: number;
}

const PodcastSection = async ({ podcastId }: PodcastSectionProps) => {
    const podcast = await podcastService.get(podcastId);
    if (!podcast) {
        return "";
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
        id: string;
    };
}

export default async function PodcastPage({ params }: PageProps) {
    const resolvedParams = await params;
    const podcastId = parseInt(resolvedParams.id, 10);

    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<GeneralPageSectionSkeleton />}>
                <PodcastSection podcastId={podcastId} />
            </Suspense>
        </main>
    );
}
