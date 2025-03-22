import { Inter } from "next/font/google";
import { NavBar } from "@/components/ui/nav-bar";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";
import { Metadata } from "next";
import { getCurrentUser } from "@/lib/database/user";
import Link from "next/link";
import { podcastService } from "@/services/podcast-service";
import { StudioPodcastsTable } from "@/components/data-tables/studio-podcasts";

export const metadata: Metadata = {
    title: "Studio",
};

const PodcastList = async () => {
    const podcasts = await podcastService.listPodcasts();

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl">
                    <span className="font-light">Podcasts</span>
                </h1>
                <Link
                    href={`/studio/podcasts/new`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Podcast
                </Link>
            </div>
            <StudioPodcastsTable podcasts={podcasts} />
        </div>
    );
};

export default async function StudioDashboardPage() {
    const user = await getCurrentUser();

    return (
        <main className="container mx-auto p-6">
            <PodcastList />
        </main>
    );
}
