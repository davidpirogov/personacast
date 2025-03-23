import "@/app/globals.css";
import { Metadata } from "next";
import { podcastService } from "@/services/podcast-service";
import { StudioPodcastsTable } from "@/components/data-tables/studio-podcasts";
import { Suspense } from "react";
import GeneralPageSection, { GeneralPageSectionSkeleton } from "@/components/page-sections/general-page-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Studio",
};

const PodcastList = async () => {
    const podcasts = await podcastService.list();

    return (
        <GeneralPageSection
            title="Podcasts"
            description="Manage your podcasts"
            link={
                <Link href="/studio/podcasts/new">
                    <Button variant="outline">+ New Podcast</Button>
                </Link>
            }
        >
            <StudioPodcastsTable podcasts={podcasts} />
        </GeneralPageSection>
    );
};

export default async function StudioDashboardPage() {
    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<GeneralPageSectionSkeleton />}>
                <PodcastList />
            </Suspense>
        </main>
    );
}
