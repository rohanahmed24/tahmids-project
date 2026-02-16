"use client";

import { CustomAudioPlayer } from "@/components/ui/CustomAudioPlayer";

interface ArticleAudioPlayerProps {
    title: string;
    audioUrl?: string | null;
}

export function ArticleAudioPlayer({ title, audioUrl }: ArticleAudioPlayerProps) {
    if (!audioUrl?.trim()) return null;

    return <CustomAudioPlayer src={audioUrl} title={title} />;
}
