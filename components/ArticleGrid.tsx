"use client";

import { Assets } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileSlider } from "@/components/ui/MobileSlider";
import { MediaOptions } from "@/components/ui/MediaOptions";
import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

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
    { id: 9, title: "Understanding Modern Architecture", author: "Sarah Jenkins", date: "Dec 10", img: Assets.imgArticleBreakout, category: "Design", slug: "modern-architecture", topicSlug: "design-culture" },
    { id: 10, title: "The Future of Work and Automation", author: "David Miller", date: "Dec 9", img: Assets.imgStoryHistory, category: "Tech", slug: "future-work", topicSlug: "technology-ai" },
    { id: 11, title: "Meditation and Mental Health", author: "Emily Rose", date: "Dec 8", img: Assets.imgStoryScience, category: "Psychology", slug: "meditation", topicSlug: "psychology" },
    { id: 12, title: "Sustainable Living in Urban Spaces", author: "James L.", date: "Dec 7", img: Assets.imgArticleFutureCities, category: "Lifestyle", slug: "sustainable-living", topicSlug: "future-tech" },
];

// Horizontal Slider Component
function HorizontalSlider({ articles, direction = "left" }: { articles: Article[]; direction?: "left" | "right" }) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const cardWidth = 350;
    const gap = 32;
    const totalWidth = articles.length * (cardWidth + gap);
    const maxDrag = -(totalWidth - containerWidth);

    // Scroll to specific index
    const scrollToIndex = useCallback((index: number) => {
        const targetX = -(index * (cardWidth + gap));
        const clampedX = Math.max(maxDrag, Math.min(0, targetX));
        animate(x, clampedX, {
            type: "spring",
            stiffness: 300,
            damping: 30,
        });
        setCurrentIndex(index);
    }, [cardWidth, gap, maxDrag, x]);

    // Auto-advance slider
    useEffect(() => {
        if (containerWidth === 0 || isPaused || articles.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const nextIndex = direction === "left"
                    ? (prev + 1) % articles.length
                    : (prev - 1 + articles.length) % articles.length;
                scrollToIndex(nextIndex);
                return nextIndex;
            });
        }, 3000); // Advance every 3 seconds

        return () => clearInterval(timer);
    }, [containerWidth, isPaused, articles.length, direction, scrollToIndex]);

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

    // Handle drag end
    const handleDragEnd = () => {
        const currentX = x.get();
        const newIndex = Math.round(-currentX / (cardWidth + gap));
        const clampedIndex = Math.max(0, Math.min(articles.length - 1, newIndex));
        scrollToIndex(clampedIndex);
        setIsPaused(false);
    };

    const goToPrevious = () => {
        const newIndex = (currentIndex - 1 + articles.length) % articles.length;
        scrollToIndex(newIndex);
    };

    const goToNext = () => {
        const newIndex = (currentIndex + 1) % articles.length;
        scrollToIndex(newIndex);
    };

    return (
        <div className="relative group">
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
                    onDragEnd={handleDragEnd}
                >
                    {articles.map(renderArticleCard)}
                </motion.div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-bg-card/90 hover:bg-bg-card rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                aria-label="Previous"
            >
                <span className="text-text-primary text-xl">←</span>
            </button>

            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-bg-card/90 hover:bg-bg-card rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                aria-label="Next"
            >
                <span className="text-text-primary text-xl">→</span>
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {articles.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                            index === currentIndex
                                ? "bg-accent w-8"
                                : "bg-text-muted/30 w-2 hover:bg-text-muted/50"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export function ArticleGrid() {
    const router = useRouter();

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
                            <span className="text-text-muted text-xs font-sans font-bold tracking-widest uppercase">The List</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-text-primary leading-tight">
                                Latest <span className="italic font-light">Perspectives</span>
                            </h2>
                        </div>

                        <Link
                            href="/stories"
                            className="group flex items-center gap-2 text-sm font-bold font-sans uppercase tracking-wider text-text-primary hover:text-accent transition-colors"
                        >
                            View All <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile: Draggable Slider */}
                <div className="md:hidden -mx-6">
                    <MobileSlider autoplayInterval={3000} cardWidthPercent={90} gap={16}>
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => router.push(`/article/${article.slug}`)}
                                className="group flex flex-col bg-bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="relative w-full aspect-[16/9] overflow-hidden">
                                    <Image
                                        src={article.img}
                                        alt={article.title}
                                        fill
                                        sizes="90vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                        <span className="text-accent">{article.category}</span>
                                        <span>•</span>
                                        <span>{article.date}</span>
                                    </div>
                                    <h3 className="text-base font-serif font-semibold leading-tight text-text-primary line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-2 pt-2">
                                        <div className="w-6 h-6 rounded-full bg-bg-secondary relative overflow-hidden">
                                            <Image src={Assets.imgAvatarImage} alt="Avatar" fill sizes="24px" className="object-cover" />
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
                    <HorizontalSlider articles={topRowArticles} direction="left" />
                    <HorizontalSlider articles={bottomRowArticles} direction="right" />
                </div>
            </div>
        </section>
    );
}

