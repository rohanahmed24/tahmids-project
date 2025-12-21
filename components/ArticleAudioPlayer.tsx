"use client";

import { AudioPlayer } from "@/components/ui/AudioPlayer";

interface ArticleAudioPlayerProps {
    title: string;
    content: string;
}

export function ArticleAudioPlayer({ title, content }: ArticleAudioPlayerProps) {
    return <AudioPlayer title={title} content={content} />;
}
