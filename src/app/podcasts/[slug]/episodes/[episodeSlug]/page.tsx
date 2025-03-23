import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPodcastBySlug } from "@/lib/database/podcasts";
import { getEpisodeBySlug } from "@/lib/database/episodes";

interface EpisodePageProps {
    params: {
        slug: string;
        episodeSlug: string;
    };
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
    const podcast = await getPodcastBySlug(params.slug);
    if (!podcast) return { title: "Episode Not Found" };

    const episode = await getEpisodeBySlug(params.episodeSlug);
    if (!episode) return { title: "Episode Not Found" };

    return {
        title: `${episode.title} - ${podcast.title} | PersonaCast`,
        description: episode.description,
    };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
    const podcast = await getPodcastBySlug(params.slug);
    if (!podcast || !podcast.isPublic) {
        notFound();
    }

    const episode = await getEpisodeBySlug(params.episodeSlug);
    if (!episode || episode.podcastId !== podcast.id) {
        notFound();
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Podcast Navigation */}
                <div className="mb-8">
                    <a 
                        href={`/podcasts/${podcast.slug}`}
                        className="text-primary hover:text-primary/80 flex items-center"
                    >
                        <svg 
                            className="w-4 h-4 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 19l-7-7 7-7" 
                            />
                        </svg>
                        Back to {podcast.title}
                    </a>
                </div>

                {/* Episode Content */}
                <article>
                    <h1 className="text-4xl font-bold mb-4">{episode.title}</h1>
                    
                    {/* Audio Player */}
                    <div className="bg-card rounded-lg p-4 mb-6">
                        <audio 
                            controls 
                            className="w-full" 
                            preload="metadata"
                        >
                            <source src={episode.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>

                    {/* Episode Details */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Episode Notes</h2>
                            <p className="whitespace-pre-wrap">{episode.description}</p>
                        </div>

                        {episode.showNotes && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-semibold mb-4">Show Notes</h2>
                                <div className="whitespace-pre-wrap">{episode.showNotes}</div>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </main>
    );
} 