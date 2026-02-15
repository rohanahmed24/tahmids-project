"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileSlider } from "@/components/ui/MobileSlider";
import { HorizontalSlider } from "@/components/HorizontalSlider";
import { Post } from "@/lib/posts";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ArticleGridProps {
    articles: Post[];
}

export function ArticleGrid({ articles = [] }: ArticleGridProps) {
    const router = useRouter();
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            listLabel: "তালিকা",
            latest: "সর্বশেষ",
            perspectives: "দৃষ্টিভঙ্গি",
            viewAll: "সব দেখুন",
        }
        : {
            listLabel: "The List",
            latest: "Latest",
            perspectives: "Perspectives",
            viewAll: "View All",
        };

    // Split articles into top 6 and bottom 6 for desktop slider
    const topRowArticles = articles.slice(0, 6);
    const bottomRowArticles = articles.slice(6, 12);

    return (
        <section className="w-full bg-bg-primary py-16 md:py-24 border-t border-border-subtle">
            <div className="w-full px-6 md:px-12 lg:px-16">
                {/* Header */}
                <div className="max-w-[1400px] mx-auto mb-12 md:mb-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-border-subtle">
                        <div className="space-y-3">
                            <span className="text-text-muted text-xs font-sans font-bold tracking-widest uppercase">{copy.listLabel}</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-text-primary leading-tight">
                                {copy.latest} <span className="italic font-light">{copy.perspectives}</span>
                            </h2>
                        </div>

                        <Link
                            href="/stories"
                            className="group flex items-center gap-2 text-sm font-bold font-sans uppercase tracking-wider text-text-primary hover:text-accent transition-colors"
                        >
                            {copy.viewAll} <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile: Draggable Slider */}
                <div className="md:hidden -mx-6">
                    <MobileSlider autoplayInterval={3000} cardWidthPercent={90} gap={16}>
                        {articles.map((article) => (
                            <div
                                key={article.slug}
                                onClick={() => router.push(`/article/${article.slug}`)}
                                className="group flex flex-col bg-bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="relative w-full aspect-[16/9] overflow-hidden">
                                    <Image
                                        src={article.coverImage || '/placeholder.jpg'}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 768px) 85vw, 400px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                        <span className="text-accent">{article.category}</span>
                                        <span>•</span>
                                        <span>{article.date}</span>
                                    </div>
                                    <h3 className="text-base font-serif font-semibold leading-tight text-text-primary line-clamp-3">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-2 pt-2">
                                        <div className="w-6 h-6 rounded-full bg-bg-secondary relative overflow-hidden">
                                            <Image src={article.authorImage || "/imgs/default-avatar.svg"} alt="Avatar" fill sizes="24px" className="object-cover" />
                                        </div>
                                        <span className="text-xs font-medium text-text-secondary">{article.author}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </MobileSlider>
                </div>

                {/* Desktop: 2 Horizontal Sliders */}
                <div className="hidden md:block max-w-[1600px] mx-auto space-y-16">
                    <HorizontalSlider articles={topRowArticles} />
                    <HorizontalSlider articles={bottomRowArticles} />
                </div>
            </div>
        </section>
    );
}
