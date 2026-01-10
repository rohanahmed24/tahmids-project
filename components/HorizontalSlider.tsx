"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { Post } from "@/lib/posts";
import { ArticleCard } from "@/components/ArticleCard";

interface HorizontalSliderProps {
    articles: Post[];
    direction?: "left" | "right";
}

export function HorizontalSlider({ articles, direction = "left" }: HorizontalSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // STRICT 4-CARDS-PER-VIEW CONFIGURATION
    const cardWidth = 350; // Fixed card width in pixels
    const gap = 32; // Gap between cards in pixels
    const cardsPerView = 4; // MAXIMUM 4 cards visible at once - STRICTLY ENFORCED
    const visibleCards = Math.min(articles.length, cardsPerView); // Never exceed 4

    // Calculate exact container width for 4 cards: (4 × 350px) + (3 × 32px gaps) = 1496px
    const sliderWidth = visibleCards * cardWidth + (visibleCards - 1) * gap;

    // Total width of all cards in the slider
    const totalWidth = articles.length * (cardWidth + gap);

    // Maximum drag distance to show only visible cards
    const maxDrag = -(totalWidth - sliderWidth);

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
        if (isPaused || articles.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const nextIndex = direction === "left"
                    ? (prev + 1) % articles.length
                    : (prev - 1 + articles.length) % articles.length;
                return nextIndex;
            });
        }, 3000); // Advance every 3 seconds

        return () => clearInterval(timer);
    }, [isPaused, articles.length, direction]);

    // Sync slider position with currentIndex
    useEffect(() => {
        scrollToIndex(currentIndex);
    }, [currentIndex, scrollToIndex]);

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
        <div
            className="relative group mx-auto"
            style={{
                width: `${sliderWidth}px`,
                minWidth: `${sliderWidth}px`,
                maxWidth: '100%'
            }}
        >
            <div
                ref={containerRef}
                className="overflow-hidden w-full"
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
                    {articles.map((article) => (
                        <ArticleCard key={article.slug} article={article} width={cardWidth} />
                    ))}
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
                        className={`h-2 rounded-full transition-all ${index === currentIndex
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
