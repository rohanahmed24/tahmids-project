"use client";

import { Headphones } from "lucide-react";
import { CustomAudioPlayer } from "@/components/ui/CustomAudioPlayer";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ArticleAudioPlayerProps {
    title: string;
    audioUrl?: string | null;
}

export function ArticleAudioPlayer({ title, audioUrl }: ArticleAudioPlayerProps) {
    const { locale } = useLocale();

    if (!audioUrl?.trim()) return null;

    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2 text-text-primary">
                <Headphones className="w-4 h-4" />
                <h3 className="text-sm font-semibold">
                    {locale === "bn" ? "অডিও সংস্করণ" : "Audio Version"}
                </h3>
            </div>
            <CustomAudioPlayer src={audioUrl} title={title} />
        </section>
    );
}
