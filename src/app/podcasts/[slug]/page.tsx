import { Metadata } from "next";
import { notFound } from "next/navigation";
import { podcastService } from "@/services/podcast-service";
import { episodeService } from "@/services/episode-service";

interface PodcastPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PodcastPageProps): Promise<Metadata> {
    const podcast = await podcastService.getPodcastBySlug(params.slug);

    if (!podcast) {
        return {
            title: "Podcast Not Found",
        };
    }

    return {
        title: `${podcast.title} | PersonaCast`,
        description: podcast.description,
    };
}

export default async function PodcastPage({ params }: PodcastPageProps) {
    const awaitedParams = await params;
    const slug = awaitedParams.slug;
    const podcast = await podcastService.getPodcastBySlug(awaitedParams.slug);

    console.log(podcast);

    if (!podcast || !podcast.published) {
        notFound();
    }

    const episodes = await episodeService.getEpisodesByPodcastId(podcast.id);

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Podcast Cover */}
                <div className="md:col-span-1">
                    {podcast.heroImage && (
                        <div className="aspect-square relative rounded-lg overflow-hidden">
                            <img
                                src={podcast.heroImage.url}
                                alt={podcast.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}
                </div>

                {/* Podcast Info */}
                <div className="md:col-span-2">
                    <h1 className="text-4xl font-bold mb-4">{podcast.title}</h1>
                    <p className="text-lg text-muted-foreground mb-6">{podcast.description}</p>

                    {/* RSS Feed Link */}
                    <a
                        href={`/podcasts/${podcast.slug}/feed.xml`}
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.75 3a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75H4c6.075 0 11 4.925 11 11v.25c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75V16C17 8.82 11.18 3 4 3h-.25z" />
                            <path d="M3 8.75A.75.75 0 013.75 8H4a8 8 0 018 8v.25a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75V16a6 6 0 00-6-6h-.25A.75.75 0 013 9.25v-.5zM7 15a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Subscribe to RSS Feed
                    </a>
                </div>
            </div>

            {/* Episodes List */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Episodes</h2>
                <div className="space-y-4">
                    {episodes.map((episode) => (
                        <article
                            key={episode.id}
                            className="bg-card rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <a href={`/podcasts/${podcast.slug}/episodes/${episode.slug}`}>
                                <h3 className="text-xl font-medium mb-2">{episode.title}</h3>
                                <p className="text-muted-foreground line-clamp-2">{episode.description}</p>
                            </a>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
