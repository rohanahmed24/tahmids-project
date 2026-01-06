"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaOptions } from "@/components/ui/MediaOptions";
import { Assets } from "@/lib/assets";
import { Article } from "@/lib/mock-data";

interface ArticleCardProps {
    article: Article;
    width: number;
}

export function ArticleCard({ article, width }: ArticleCardProps) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/article/${article.slug}`)}
            className="group flex flex-col gap-5 cursor-pointer text-text-primary flex-shrink-0"
            style={{ width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` }}
        >
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-bg-card shadow-sm transition-shadow group-hover:shadow-md">
                <Image
                    src={article.img}
                    alt={article.title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-wider">
                    {article.topicSlug ? (
                        <Link
                            href={`/topics/${article.topicSlug}`}
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
                <h3 className="text-lg md:text-xl font-serif font-semibold leading-tight group-hover:text-accent transition-colors">
                    {article.title}
                </h3>
                <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-secondary relative overflow-hidden">
                            <Image src={Assets.imgAvatarImage} alt="Avatar" fill sizes="32px" className="object-cover" />
                        </div>
                        <span className="text-xs font-sans font-medium text-text-secondary">{article.author}</span>
                    </div>
                    <MediaOptions slug={article.slug} variant="compact" />
                </div>
            </div>
        </div>
    );
}
