import { Metadata } from "next";
import { podcastService } from "@/services/podcast-service";

export const metadata: Metadata = {
    title: "Podcasts | PersonaCast",
    description: "Browse our collection of podcasts",
};

export const revalidate = 3600; // Revalidate every hour

interface PodcastCard {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    slug: string;
}

export default async function PodcastsPage() {
    const podcasts = await podcastService.list();

    return (
        <main className="container pt-16 mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Podcasts</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts.map((podcast) => (
                    <article
                        key={podcast.id}
                        className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        <a href={`/podcasts/${podcast.id}`} className="block">
                            {/* {podcast.imageUrl && (
                                <div className="aspect-square relative">
                                    <img
                                        src={podcast.imageUrl}
                                        alt={podcast.title}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )} */}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{podcast.title}</h2>
                                <p className="line-clamp-2">{podcast.description}</p>
                            </div>
                        </a>
                    </article>
                ))}
            </div>
        </main>
    );
}
