"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { DecorativeBackgrounds } from "@/components/ui/DecorativeBackgrounds";
import { MediaOptions } from "@/components/ui/MediaOptions";

const breakingNews = [
    { id: "01", category: "Design", title: "The quiet revolution of slow interfaces", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Sarah Jenkins", date: "Dec 24" },
    { id: "02", category: "Tech", title: "Why we need less information, not more", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "David Miller", date: "Dec 23" },
    { id: "03", category: "Philosophy", title: "Building a digital garden for the mind", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "John Smith", date: "Dec 22" },
    { id: "04", category: "Technology", title: "The Ethics of Artificial Intelligence", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "David Miller", date: "Dec 15" },
    { id: "05", category: "Science", title: "The Science of Sleep: Why Rest Matters", img: Assets.imgStoryCulture, slug: "science-sleep", author: "Emily Rose", date: "Dec 9" },
    { id: "06", category: "Lifestyle", title: "Mindful Living in a Digital Age", img: Assets.imgStoryScience, slug: "mindful-living", author: "Sarah Jenkins", date: "Dec 18" },
    { id: "07", category: "Future Tech", title: "Cities of Tomorrow: Reimagining Urban Life", img: Assets.imgStoryArt, slug: "future-cities", author: "James L.", date: "Dec 14" },
    { id: "08", category: "Culture", title: "The Creative Process Unveiled", img: Assets.imgStoryHistory, slug: "creative-process", author: "Sarah Jenkins", date: "Dec 12" },
    { id: "09", category: "Design", title: "Minimalism in Modern Design", img: Assets.imgPlaceholderImage1, slug: "minimalism-design", author: "Sarah Jenkins", date: "Dec 11" },
    { id: "10", category: "Tech", title: "Blockchain and the Future", img: Assets.imgPlaceholderImage2, slug: "blockchain-future", author: "David Miller", date: "Dec 10" },
    { id: "11", category: "Science", title: "Climate Change Solutions", img: Assets.imgStoryCulture, slug: "climate-solutions", author: "Emily Rose", date: "Dec 9" },
    { id: "12", category: "Culture", title: "The Art of Storytelling", img: Assets.imgStoryHistory, slug: "art-storytelling", author: "John Smith", date: "Dec 8" },
];

// Desktop Horizontal Slider Component
function FeaturedHorizontalSlider({ items, direction = "left" }: { items: typeof breakingNews; direction?: "left" | "right" }) {
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
    const gap = 24;
    const cardsPerView = 4; // Maximum 4 cards visible at once
    const visibleCards = Math.min(items.length, cardsPerView);
    const containerMaxWidth = visibleCards * cardWidth + (visibleCards - 1) * gap;
    const totalWidth = items.length * (cardWidth + gap);
    const maxDrag = -(totalWidth - (visibleCards * cardWidth + (visibleCards - 1) * gap));

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
        if (containerWidth === 0 || isPaused || items.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const nextIndex = direction === "left"
                    ? (prev + 1) % items.length
                    : (prev - 1 + items.length) % items.length;
                scrollToIndex(nextIndex);
                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(timer);
    }, [containerWidth, isPaused, items.length, direction, scrollToIndex]);

    // Handle drag end
    const handleDragEnd = () => {
        const currentX = x.get();
        const newIndex = Math.round(-currentX / (cardWidth + gap));
        const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));
        scrollToIndex(clampedIndex);
        setIsPaused(false);
    };

    const goToPrevious = () => {
        const newIndex = (currentIndex - 1 + items.length) % items.length;
        scrollToIndex(newIndex);
    };

    const goToNext = () => {
        const newIndex = (currentIndex + 1) % items.length;
        scrollToIndex(newIndex);
    };

    return (
        <div className="relative group mx-auto" style={{ width: `${containerMaxWidth}px`, maxWidth: '100%' }}>
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
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/article/${item.slug}`}
                            className="flex-shrink-0 group"
                            style={{ width: cardWidth }}
                        >
                            <div className="relative aspect-[16/9] overflow-hidden mb-4 transition-all duration-700 rounded-lg">
                                <Image
                                    src={item.img}
                                    fill
                                    sizes="300px"
                                    alt={item.title}
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 uppercase font-bold tracking-widest text-[10px]">
                                    <span className="text-accent">{item.category}</span>
                                    <span className="text-text-muted">•</span>
                                    <span className="text-text-muted">{item.date}</span>
                                </div>
                                <h3 className="font-serif leading-tight group-hover:underline decoration-1 underline-offset-4 text-text-primary line-clamp-2 text-base">
                                    {item.title}
                                </h3>
                                <MediaOptions slug={item.slug} variant="compact" className="mt-2" />
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/3 -translate-y-1/2 w-12 h-12 bg-bg-card/90 hover:bg-bg-card rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                aria-label="Previous"
            >
                <span className="text-text-primary text-xl">←</span>
            </button>

            <button
                onClick={goToNext}
                className="absolute right-4 top-1/3 -translate-y-1/2 w-12 h-12 bg-bg-card/90 hover:bg-bg-card rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                aria-label="Next"
            >
                <span className="text-text-primary text-xl">→</span>
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {items.map((_, index) => (
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

export function FeaturedTales() {
    const [currentPage, setCurrentPage] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const cardsPerPage = 2;
    const gap = 12;
    const totalPages = Math.ceil(breakingNews.length / cardsPerPage);

    // Split breakingNews into top 6 and bottom 6 for desktop sliders
    const topRowItems = breakingNews.slice(0, 6);
    const bottomRowItems = breakingNews.slice(6, 12);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cardWidth = containerWidth > 0 ? (containerWidth - gap) / 2 : 150;
    const slideWidth = containerWidth;
    const maxDrag = -slideWidth * (totalPages - 1);

    const snapToPage = (page: number) => {
        const targetX = -page * slideWidth;
        animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
        setCurrentPage(page);
    };

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const threshold = slideWidth / 4;

        let newPage = currentPage;
        if (offset < -threshold || velocity < -500) {
            newPage = Math.min(currentPage + 1, totalPages - 1);
        } else if (offset > threshold || velocity > 500) {
            newPage = Math.max(currentPage - 1, 0);
        }
        snapToPage(newPage);
    };

    // Autoslide every 2 seconds
    useEffect(() => {
        if (containerWidth === 0) return;

        const timer = setInterval(() => {
            setCurrentPage(prev => {
                const next = (prev + 1) % totalPages;
                const targetX = -next * slideWidth;
                animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
                return next;
            });
        }, 2000);

        return () => clearInterval(timer);
    }, [containerWidth, slideWidth, totalPages, x]);

    return (
        <section className="relative w-full pt-8 pb-4 md:py-24 bg-bg-primary overflow-hidden">
            <DecorativeBackgrounds />

            <div className="max-w-[1800px] mx-auto px-4 md:px-12 relative z-10">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-3 md:mb-16">
                    <h2
                        className="font-serif font-medium tracking-tight text-text-primary"
                        style={{ fontSize: 'clamp(1.125rem, 4vw, 3.75rem)' }}
                    >
                        Latest <span className="italic font-light opacity-60">Articles</span>
                    </h2>
                </div>

                {/* Mobile: 2 Cards Side by Side Draggable Slider */}
                <div className="md:hidden relative" ref={containerRef}>
                    <div className="overflow-hidden">
                        <motion.div
                            className="flex"
                            style={{ x, gap: `${gap}px` }}
                            drag="x"
                            dragConstraints={{ left: maxDrag, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={handleDragEnd}
                        >
                            {breakingNews.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/article/${item.slug}`}
                                    className="flex-shrink-0"
                                    style={{ width: cardWidth }}
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-2">
                                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-600/90 text-[8px] uppercase font-bold tracking-wider text-white rounded z-20">
                                            {item.category}
                                        </span>
                                        <Image
                                            src={item.img}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            alt={item.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    </div>
                                    <h3 className="text-xs font-serif leading-tight text-text-primary line-clamp-3 mb-1">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-[9px] text-text-muted">
                                        <span className="text-accent">●</span>
                                        <span>{item.author}</span>
                                        <span>·</span>
                                        <span>{item.date}</span>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </div>



                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-1.5 mt-3">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => snapToPage(index)}
                                className={`h-1.5 rounded-full transition-all ${index === currentPage
                                    ? "bg-accent w-4"
                                    : "bg-text-muted/30 w-1.5 hover:bg-text-muted/50"
                                    }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: 2 Horizontal Sliders with opposite directions */}
                <div className="hidden md:block space-y-12">
                    <FeaturedHorizontalSlider items={topRowItems} direction="left" />
                    <FeaturedHorizontalSlider items={bottomRowItems} direction="right" />
                </div>
            </div>
        </section>
    );
}
