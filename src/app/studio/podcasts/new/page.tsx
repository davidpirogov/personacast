import { Suspense } from "react";
import { NewPodcastForm } from "@/components/forms/studio-podcast-new";
import { Loader } from "@/components/ui/loading";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/database/user";

export const metadata: Metadata = {
    title: "New Podcast",
};

export default async function NewPodcastPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    return (
        <Suspense fallback={<Loader />}>
            <NewPodcastForm />
        </Suspense>
    );
}
