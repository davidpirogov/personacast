import { Suspense } from "react";
import { NewPodcastForm } from "@/components/forms/studio-podcast-new";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/database/user";
import GeneralPageSection, { GeneralPageSectionSkeleton } from "@/components/sections/general-page-section";

export const metadata: Metadata = {
    title: "New Podcast",
};

export default async function NewPodcastPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    return (
        <main className="container mx-auto p-6">
            <Suspense fallback={<GeneralPageSectionSkeleton />}>
                <GeneralPageSection title="New Podcast" description={`Create a new podcast`}>
                    <NewPodcastForm />
                </GeneralPageSection>
            </Suspense>
        </main>
    );
}
