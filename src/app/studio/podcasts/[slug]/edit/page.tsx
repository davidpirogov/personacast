import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/database/user";
import { podcastService } from "@/services/podcast-service";
import { EditPodcastForm } from "@/components/forms/studio-podcast-edit";
import GeneralPageSection, { GeneralPageSectionSkeleton } from "@/components/sections/general-page-section";

export const metadata: Metadata = {
    title: "Edit Podcast",
};

interface EditPodcastPageProps {
    params: {
        slug: string;
    };
}

export default async function EditPodcastPage({ params }: EditPodcastPageProps) {
    const awaitedParams = await params;
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    const podcast = await podcastService.getPodcastBySlug(awaitedParams.slug);
    if (!podcast) {
        redirect("/studio/podcasts");
    }

    return (
        <main data-theme="workzone" className="container mx-auto mt-12 p-6">
            <Suspense fallback={<GeneralPageSectionSkeleton />}>
                <GeneralPageSection title="Edit Podcast" description={`Edit details for ${podcast.title}`}>
                    <EditPodcastForm podcast={podcast} />
                </GeneralPageSection>
            </Suspense>
        </main>
    );
}
