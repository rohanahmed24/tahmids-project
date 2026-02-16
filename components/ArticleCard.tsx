"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaOptions } from "@/components/ui/MediaOptions";
import { Post } from "@/lib/posts";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ArticleCardProps {
    article: Post;
    width?: number;
}

export function ArticleCard({ article, width }: ArticleCardProps) {
    const router = useRouter();
    const { locale } = useLocale();

    const style = width ? { width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` } : { width: '100%' };

    return (
        <div
            onClick={() => router.push(`/article/${article.slug}`)}
            className="group flex flex-col gap-5 cursor-pointer text-text-primary flex-shrink-0"
            style={style}
        >
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-bg-card shadow-sm transition-shadow group-hover:shadow-md">
                <Image
                    src={article.coverImage || '/placeholder.jpg'}
                    alt={article.title}
                    fill
                    sizes={width ? `${width}px` : "(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 350px"}
                    quality={75}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-wider">
                    {article.topic_slug ? (
                        <Link
                            href={`/topics/${article.topic_slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-accent hover:underline"
                        >
                            {article.category}
                        </Link>
                    ) : (
                        <span className="text-accent">{article.category}</span>
                    )}
                    <span>•</span>
                    <span>{article.date}</span>
                </div>
                <h3 className="text-lg md:text-xl font-serif font-semibold leading-tight group-hover:text-accent transition-colors line-clamp-3">
                    {article.title}
                </h3>
                <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-secondary relative overflow-hidden">
                            <Image src="/imgs/default-avatar.svg" alt={locale === "bn" ? "প্রোফাইল ছবি" : "Avatar"} fill sizes="32px" className="object-cover" />
                        </div>
                        <span className="text-xs font-sans font-medium text-text-secondary">{article.author}</span>
                    </div>
                    <MediaOptions
                        slug={article.slug}
                        hasAudio={!!article.audioUrl && article.audioUrl.length > 5}
                        hasVideo={!!article.videoUrl && article.videoUrl.length > 5}
                        variant="compact"
                    />
                </div>
            </div>
        </div>
    );
}
