import { getPodcastBySlug } from "@/lib/database/podcasts";
import { getEpisodesByPodcastId } from "@/lib/database/episodes";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic'; // Ensure we can use Request object
export const revalidate = 3600; // Revalidate feed every hour

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const podcast = await getPodcastBySlug(params.slug);
    if (!podcast || !podcast.isPublic) {
        notFound();
    }

    const episodes = await getEpisodesByPodcastId(podcast.id);
    const baseUrl = new URL(request.url).origin;
    const podcastUrl = `${baseUrl}/podcasts/${podcast.slug}`;
    const now = new Date().toUTCString();

    // Build the RSS feed XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
    xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
    xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escapeXml(podcast.title)}</title>
        <description>${escapeXml(podcast.description)}</description>
        <link>${podcastUrl}</link>
        <language>${podcast.language || 'en-us'}</language>
        <lastBuildDate>${now}</lastBuildDate>
        <pubDate>${now}</pubDate>
        <copyright>© ${new Date().getFullYear()} ${escapeXml(podcast.author || podcast.title)}</copyright>
        
        <!-- RSS Feed URL for podcast apps -->
        <atom:link href="${podcastUrl}/feed.xml" rel="self" type="application/rss+xml" />
        
        <!-- Podcast Artwork -->
        ${podcast.imageUrl ? `<image>
            <url>${podcast.imageUrl}</url>
            <title>${escapeXml(podcast.title)}</title>
            <link>${podcastUrl}</link>
        </image>
        <itunes:image href="${podcast.imageUrl}"/>
        <googleplay:image href="${podcast.imageUrl}"/>` : ''}
        
        <!-- iTunes/Google Play Specific -->
        <itunes:explicit>${podcast.explicit ? 'yes' : 'no'}</itunes:explicit>
        <googleplay:explicit>${podcast.explicit ? 'yes' : 'no'}</googleplay:explicit>
        <itunes:author>${escapeXml(podcast.author || podcast.title)}</itunes:author>
        <googleplay:author>${escapeXml(podcast.author || podcast.title)}</googleplay:author>
        <itunes:summary>${escapeXml(podcast.description)}</itunes:summary>
        <googleplay:description>${escapeXml(podcast.description)}</googleplay:description>
        <itunes:type>episodic</itunes:type>
        ${podcast.categories?.length ? podcast.categories.map(category => 
            `<itunes:category text="${escapeXml(category)}"/>`
        ).join('\n        ') : ''}
        ${podcast.owner ? `
        <itunes:owner>
            <itunes:name>${escapeXml(podcast.owner.name)}</itunes:name>
            <itunes:email>${escapeXml(podcast.owner.email)}</itunes:email>
        </itunes:owner>` : ''}
        
        <!-- Episodes -->
        ${episodes.map(episode => `
        <item>
            <title>${escapeXml(episode.title)}</title>
            <description>${escapeXml(episode.description)}</description>
            <content:encoded><![CDATA[${episode.showNotes || episode.description}]]></content:encoded>
            <pubDate>${new Date(episode.publishedAt || episode.createdAt).toUTCString()}</pubDate>
            <enclosure
                url="${episode.audioUrl}"
                type="audio/mpeg"
                length="${episode.audioSizeBytes || 0}"
            />
            <guid isPermaLink="false">${episode.id}</guid>
            <link>${podcastUrl}/episodes/${episode.slug}</link>
            
            <!-- Episode iTunes Specific -->
            <itunes:title>${escapeXml(episode.title)}</itunes:title>
            <itunes:summary>${escapeXml(episode.description)}</itunes:summary>
            <itunes:duration>${formatDuration(episode.durationSeconds || 0)}</itunes:duration>
            <itunes:explicit>${episode.explicit ? 'yes' : 'no'}</itunes:explicit>
            ${episode.episodeNumber ? `<itunes:episode>${episode.episodeNumber}</itunes:episode>` : ''}
            ${episode.seasonNumber ? `<itunes:season>${episode.seasonNumber}</itunes:season>` : ''}
            ${episode.episodeType ? `<itunes:episodeType>${episode.episodeType}</itunes:episodeType>` : ''}
            ${episode.imageUrl ? `<itunes:image href="${episode.imageUrl}"/>` : ''}
        </item>`).join('\n        ')}
    </channel>
</rss>`;

    // Get ETag for the content
    const etag = Buffer.from(rss).toString('base64').substring(0, 27);
    
    // Check if client has a cached version
    const clientEtag = request.headers.get('If-None-Match');
    if (clientEtag === etag) {
        return new Response(null, { status: 304 }); // Not Modified
    }

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml;charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
            'ETag': etag,
            'Last-Modified': now,
        },
    });
}

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 