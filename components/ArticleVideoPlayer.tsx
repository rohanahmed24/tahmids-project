"use client";

import { Play, Youtube } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ArticleVideoPlayerProps {
    videoUrl: string;
    title: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;
    
    let videoId = null;
    
    // Handle various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/ // Just the video ID
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            videoId = match[1];
            break;
        }
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
}

export function ArticleVideoPlayer({ videoUrl, title }: ArticleVideoPlayerProps) {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            unsupported: "আপনার ব্রাউজার ভিডিও ট্যাগ সমর্থন করে না।",
            watchMode: "দেখার মোড",
            youtube: "ইউটিউব",
            video: "ভিডিও",
            content: "কনটেন্ট",
        }
        : {
            unsupported: "Your browser does not support the video tag.",
            watchMode: "Watch mode",
            youtube: "YouTube",
            video: "Video",
            content: "content",
        };

    const youtubeEmbedUrl = isYouTubeUrl(videoUrl) ? getYouTubeEmbedUrl(videoUrl) : null;
    
    return (
        <div className="w-full rounded-xl overflow-hidden bg-bg-secondary border border-border-subtle shadow-lg">
            <div className="relative aspect-video">
                {youtubeEmbedUrl ? (
                    <iframe
                        src={youtubeEmbedUrl}
                        title={title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                ) : (
                    <video
                        controls
                        className="w-full h-full object-cover"
                        poster=""
                        preload="metadata"
                    >
                        <source src={videoUrl} type="video/mp4" />
                        {copy.unsupported}
                    </video>
                )}
            </div>
            <div className="p-4 bg-bg-tertiary border-t border-border-subtle">
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                    {youtubeEmbedUrl ? <Youtube className="w-4 h-4 text-red-500" /> : <Play className="w-4 h-4" />}
                    <span className="font-medium">{title}</span>
                </div>
                <p className="text-xs text-text-tertiary mt-1">{copy.watchMode} • {youtubeEmbedUrl ? copy.youtube : copy.video} {copy.content}</p>
            </div>
        </div>
    );
}
