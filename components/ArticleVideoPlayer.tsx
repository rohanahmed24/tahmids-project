"use client";

import { Play } from "lucide-react";

interface ArticleVideoPlayerProps {
    videoUrl: string;
    title: string;
}

export function ArticleVideoPlayer({ videoUrl, title }: ArticleVideoPlayerProps) {
    return (
        <div className="w-full rounded-xl overflow-hidden bg-bg-secondary border border-border-subtle shadow-lg">
            <div className="relative aspect-video">
                <video
                    controls
                    className="w-full h-full object-cover"
                    poster=""
                    preload="metadata"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="p-4 bg-bg-tertiary border-t border-border-subtle">
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Play className="w-4 h-4" />
                    <span className="font-medium">{title}</span>
                </div>
                <p className="text-xs text-text-tertiary mt-1">Watch mode • Video content</p>
            </div>
        </div>
    );
}
