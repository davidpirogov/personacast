import "@/app/globals.css";
import { Metadata } from "next";
import { podcastService } from "@/services/podcast-service";
import { StudioPodcastsTable } from "@/components/data-tables/studio-podcasts";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loading";
import ListPageSection from "@/components/page-sections/list-page-section";

export const metadata: Metadata = {
    title: "Studio",
};

const PodcastList = async () => {
    const podcasts = await podcastService.list();

    return (
        <ListPageSection title="Podcasts" description="Manage your podcasts">
            <StudioPodcastsTable podcasts={podcasts} />
        </ListPageSection>
    );
};

export default async function StudioDashboardPage() {
    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<Loader />}>
                <PodcastList />
            </Suspense>
        </main>
    );
}
