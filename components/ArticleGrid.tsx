"use client";

import { Assets } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileSlider } from "@/components/ui/MobileSlider";
import { MediaOptions } from "@/components/ui/MediaOptions";
import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useRef, useEffect } from "react";

type Article = {
    id: number;
    title: string;
    author: string;
    date: string;
    img: string;
    category: string;
    slug: string;
    topicSlug: string | null;
};

const articles: Article[] = [
    { id: 1, title: "The quiet revolution of slow interfaces", author: "Sarah Jenkins", date: "Dec 24", img: Assets.imgArticleBreakout, category: "Design", slug: "slow-interfaces", topicSlug: "design-culture" },
    { id: 2, title: "Why we need less information, not more", author: "David Miller", date: "Dec 23", img: Assets.imgStoryHistory, category: "Tech", slug: "less-information", topicSlug: "technology-ai" },
    { id: 3, title: "Building a digital garden for the mind", author: "John Smith", date: "Dec 22", img: Assets.imgArticleHero, category: "Philosophy", slug: "digital-garden", topicSlug: null },
    { id: 4, title: "The Ethics of Artificial Intelligence", author: "David Miller", date: "Dec 15", img: Assets.imgArticleAiEthics, category: "Technology", slug: "ai-ethics", topicSlug: "technology-ai" },
    { id: 5, title: "Cities of Tomorrow", author: "James L.", date: "Dec 14", img: Assets.imgArticleFutureCities, category: "Future Tech", slug: "future-cities", topicSlug: "future-tech" },
    { id: 6, title: "The Art of Mindful Living", author: "Emily Rose", date: "Dec 13", img: Assets.imgStoryScience, category: "Psychology", slug: "mindful-living", topicSlug: "psychology" },
    { id: 7, title: "The Creative Process Unveiled", author: "Sarah Jenkins", date: "Dec 12", img: Assets.imgStoryArt, category: "Design", slug: "creative-process", topicSlug: "design-culture" },
    { id: 8, title: "The Remote Work Revolution", author: "David Miller", date: "Dec 11", img: Assets.imgStoryCulture, category: "Culture", slug: "remote-work", topicSlug: "design-culture" },
];

// Horizontal Slider Component
function HorizontalSlider({ articles, direction = "left" }: { articles: Article[]; direction?: "left" | "right" }) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const cardWidth = 300; // Fixed card width
    const gap = 32;
    const totalWidth = articles.length * (cardWidth + gap);
    const maxDrag = -(totalWidth - containerWidth);

    // Auto-scroll effect
    useEffect(() => {
        if (containerWidth === 0 || isPaused) return;

        const scrollRange = totalWidth - containerWidth;
        const duration = (scrollRange / 30); // 30px per second

        const startX = direction === "left" ? 0 : -scrollRange;
        const endX = direction === "left" ? -scrollRange : 0;

        const controls = animate(x, [startX, endX], {
            duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
        });

        return () => controls.stop();
    }, [containerWidth, totalWidth, direction, x, isPaused]);

    const renderArticleCard = (article: Article) => (
        <div
            key={article.id}
            onClick={() => router.push(`/article/${article.slug}`)}
            className="group flex flex-col gap-5 cursor-pointer text-text-primary"
            style={{ width: cardWidth }}
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

    return (
        <div
            ref={containerRef}
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <motion.div
                className="flex cursor-grab active:cursor-grabbing"
                style={{ x, gap }}
                drag="x"
                dragConstraints={{ left: maxDrag, right: 0 }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragStart={() => setIsPaused(true)}
                onDragEnd={() => setIsPaused(false)}
            >
                {articles.map(renderArticleCard)}
            </motion.div>
        </div>
    );
}

export function ArticleGrid() {
    const router = useRouter();

    // Split articles into top 4 and bottom 4 for desktop slider
    const topRowArticles = articles.slice(0, 4);
    const bottomRowArticles = articles.slice(4, 8);

    // Render article card component for mobile
    const renderArticleCard = (article: Article) => (
        <div
            key={article.id}
            onClick={() => router.push(`/article/${article.slug}`)}
            className="group flex flex-col gap-5 cursor-pointer text-text-primary"
        >
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-bg-card shadow-sm transition-shadow group-hover:shadow-md">
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
    );

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
                    <MobileSlider autoplayInterval={2000} cardWidthPercent={92} gap={20}>
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => router.push(`/article/${article.slug}`)}
                                className="group flex flex-row gap-3 cursor-pointer text-text-primary w-full bg-bg-secondary rounded-2xl overflow-hidden shadow-sm"
                            >
                                {/* Horizontal image on left */}
                                <div className="relative w-[35%] aspect-[3/4] shrink-0 overflow-hidden">
                                    <Image
                                        src={article.img}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 768px) 35vw, 33vw"
                                        className="object-cover"
                                    />
                                </div>
                                {/* Content on right */}
                                <div className="flex-1 py-4 pr-4 flex flex-col justify-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                                        {article.category}
                                    </span>
                                    <h3 className="text-[15px] font-serif font-bold leading-tight line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[11px] text-text-muted mt-1">
                                        <span className="font-medium">{article.author}</span>
                                        <span>•</span>
                                        <span>{article.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </MobileSlider>
                </div>

                {/* Desktop: 2 Horizontal Sliders with opposite directions */}
                <div className="hidden md:block space-y-12">
                    <HorizontalSlider articles={topRowArticles} direction="left" />
                    <HorizontalSlider articles={bottomRowArticles} direction="right" />
                </div>
            </div>
        </section>
    );
}

