"use client";

import { Assets } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileSlider } from "@/components/ui/MobileSlider";
import { MediaOptions } from "@/components/ui/MediaOptions";

const articles = [
    { id: 1, title: "The quiet revolution of slow interfaces", author: "Sarah Jenkins", date: "Dec 24", img: Assets.imgArticleBreakout, category: "Design", slug: "slow-interfaces", topicSlug: "design-culture" },
    { id: 2, title: "Why we need less information, not more", author: "David Miller", date: "Dec 23", img: Assets.imgStoryHistory, category: "Tech", slug: "less-information", topicSlug: "technology-ai" },
    { id: 3, title: "Building a digital garden for the mind", author: "John Smith", date: "Dec 22", img: Assets.imgArticleHero, category: "Philosophy", slug: "digital-garden", topicSlug: null },
    { id: 4, title: "The Ethics of Artificial Intelligence", author: "David Miller", date: "Dec 15", img: Assets.imgArticleAiEthics, category: "Technology", slug: "ai-ethics", topicSlug: "technology-ai" },
    { id: 5, title: "Cities of Tomorrow", author: "James L.", date: "Dec 14", img: Assets.imgArticleFutureCities, category: "Future Tech", slug: "future-cities", topicSlug: "future-tech" },
    { id: 6, title: "The Art of Mindful Living", author: "Emily Rose", date: "Dec 13", img: Assets.imgStoryScience, category: "Psychology", slug: "mindful-living", topicSlug: "psychology" },
    { id: 7, title: "The Creative Process Unveiled", author: "Sarah Jenkins", date: "Dec 12", img: Assets.imgStoryArt, category: "Design", slug: "creative-process", topicSlug: "design-culture" },
    { id: 8, title: "The Remote Work Revolution", author: "David Miller", date: "Dec 11", img: Assets.imgStoryCulture, category: "Culture", slug: "remote-work", topicSlug: "design-culture" },
];

export function ArticleGrid() {
    const router = useRouter();

    return (
        <section className="w-full bg-bg-primary py-12 md:py-32 px-6 md:px-16 border-t border-border-subtle">
            <div className="max-w-[1280px] mx-auto space-y-12 md:space-y-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border-subtle pb-8">
                    <div className="space-y-4">
                        <span className="text-text-muted text-xs font-sans font-bold tracking-widest uppercase">The List</span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-semibold text-text-primary leading-tight">
                            Latest <span className="italic font-light">Perspectives</span>
                        </h2>
                    </div>

                    <Link href="/stories" className="group flex items-center gap-2 text-xs md:text-sm font-bold font-sans uppercase tracking-[0.2em] text-text-primary hover:text-text-secondary transition-colors pb-1">
                        View All <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {/* Mobile: Draggable Slider with Autoplay */}
                <div className="md:hidden -mx-6 px-6">
                    <MobileSlider autoplayInterval={4000} cardWidthPercent={85} gap={12}>
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => router.push(`/article/${article.slug}`)}
                                className="group flex flex-col cursor-pointer text-text-primary w-full"
                            >
                                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
                                    <Image
                                        src={article.img}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 768px) 85vw, 33vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="pt-3 space-y-1">
                                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                                        {article.topicSlug ? (
                                            <Link
                                                href={`/topics/${article.topicSlug}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-accent"
                                            >
                                                {article.category}
                                            </Link>
                                        ) : (
                                            <span className="text-accent">{article.category}</span>
                                        )}
                                        <span className="text-text-muted">•</span>
                                        <span className="text-text-muted">{article.date}</span>
                                    </div>
                                    <h3 className="text-sm font-serif font-semibold leading-snug">
                                        {article.title}
                                    </h3>
                                    <MediaOptions slug={article.slug} variant="compact" className="mt-2" />
                                </div>
                            </div>
                        ))}
                    </MobileSlider>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => router.push(`/article/${article.slug}`)}
                            className="group flex flex-col gap-5 cursor-pointer text-text-primary"
                        >
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-bg-card shadow-sm transition-shadow group-hover:shadow-md">
                                <Image
                                    src={article.img}
                                    alt={article.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
                    ))}
                </div>
            </div>
        </section>
    );
}

