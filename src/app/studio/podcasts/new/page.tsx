import { Suspense } from "react";
import { NewPodcastForm } from "@/components/forms/studio-podcast-new";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/database/user";
import GeneralPageSection, {
    GeneralPageSectionSkeleton,
} from "@/components/page-sections/general-page-section";
export const metadata: Metadata = {
    title: "New Podcast",
};

export default async function NewPodcastPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    return (
        <Suspense fallback={<GeneralPageSectionSkeleton />}>
            <NewPodcastForm />
        </Suspense>
    );
}
