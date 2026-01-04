"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { MediaOptions } from "@/components/ui/MediaOptions";

const hotTopics = [
    {
        id: 1,
        title: "The Art of Digital Silence",
        subtitle: "Exploring minimalism in the age of noise",
        category: "Technology",
        image: Assets.imgPlaceholderImage7,
        slug: "slow-interfaces",
        accent: "from-purple-600/80 to-blue-600/80",
    },
    {
        id: 2,
        title: "Building a Digital Garden",
        subtitle: "Creating spaces for thought to grow",
        category: "Philosophy",
        image: Assets.imgPlaceholderImage5,
        slug: "digital-garden",
        accent: "from-emerald-600/80 to-teal-600/80",
    },
    {
        id: 3,
        title: "The Ethics of AI",
        subtitle: "Navigating the moral landscape of intelligence",
        category: "AI & Future",
        image: Assets.imgArticleAiEthics,
        slug: "ai-ethics",
        accent: "from-red-600/80 to-orange-600/80",
    },
    {
        id: 4,
        title: "Cities of Tomorrow",
        subtitle: "Architecture reimagined for the future",
        category: "Future Tech",
        image: Assets.imgArticleFutureCities,
        slug: "future-cities",
        accent: "from-cyan-600/80 to-blue-600/80",
    },
    {
        id: 5,
        title: "Mindful Living",
        subtitle: "The psychology of presence",
        category: "Psychology",
        image: Assets.imgStoryScience,
        slug: "mindful-living",
        accent: "from-amber-600/80 to-yellow-600/80",
    },
];

export function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [direction, setDirection] = useState(1);
    const [isDragging, setIsDragging] = useState(false);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % hotTopics.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + hotTopics.length) % hotTopics.length);
    }, []);

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    // Handle drag/swipe gestures
    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        const threshold = 30; // Reduced threshold for easier swiping
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        // Determine swipe direction based on velocity or offset
        if (velocity < -300 || offset < -threshold) {
            nextSlide();
        } else if (velocity > 300 || offset > threshold) {
            prevSlide();
        }
    };

    // Auto-slide
    useEffect(() => {
        if (!isAutoPlaying || isDragging) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, isDragging, nextSlide]);

    const currentTopic = hotTopics[currentIndex];

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 1.1,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.9,
        }),
    };

    const textVariants = {
        enter: { y: 50, opacity: 0 },
        center: { y: 0, opacity: 1 },
        exit: { y: -50, opacity: 0 },
    };

    return (
        <section
            className="relative w-full h-[50vh] md:h-screen overflow-hidden bg-black mt-14 md:mt-0"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Background Slides */}
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                >
                    <Image
                        src={currentTopic.image}
                        alt={currentTopic.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${currentTopic.accent} mix-blend-multiply opacity-60`} />
                </motion.div>
            </AnimatePresence>

            {/* Drag/Swipe Layer - Mobile touch handling - MUST be above all content */}
            <motion.div
                className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing md:hidden touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                dragMomentum={false}
                onDragStart={() => {
                    setIsDragging(true);
                    setIsAutoPlaying(false);
                }}
                onDragEnd={handleDragEnd}
            />

            {/* Hot Topics Badge - Desktop only */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="hidden md:block absolute top-32 left-12 z-20"
            >
                <div className="flex items-center gap-2 bg-orange-500/80 backdrop-blur-md rounded-full px-3 py-1.5 md:px-4 md:py-2">
                    <Flame className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white">
                        Hot Topics
                    </span>
                </div>
            </motion.div>

            {/* Main Content - At bottom on mobile */}
            <div className="absolute inset-0 flex items-end z-10">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            variants={textVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl"
                        >
                            {/* Category */}
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block font-bold uppercase tracking-widest text-white/80 mb-1 md:mb-4"
                                style={{ fontSize: 'clamp(0.625rem, 1vw, 0.875rem)' }}
                            >
                                {currentTopic.category}
                            </motion.span>

                            {/* Title */}
                            <h1
                                className="font-serif font-bold text-white leading-tight mb-2 md:mb-4"
                                style={{ fontSize: 'clamp(1.25rem, 5vw, 4.5rem)' }}
                            >
                                {currentTopic.title}
                            </h1>

                            {/* Subtitle - Show on mobile too */}
                            <p
                                className="text-white/70 mb-3 md:mb-8 max-w-xl line-clamp-2 md:line-clamp-none"
                                style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1.25rem)' }}
                            >
                                {currentTopic.subtitle}
                            </p>

                            {/* CTA Buttons - Compact on mobile, full on desktop */}
                            <div className="mt-4 md:mt-0">
                                <MediaOptions slug={currentTopic.slug} variant="prominent" className="md:hidden" />
                                <MediaOptions slug={currentTopic.slug} variant="overlay" className="hidden md:flex" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Arrows - Desktop only */}
            <div className="hidden md:flex absolute bottom-1/2 -translate-y-1/2 left-8 z-20">
                <motion.button
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevSlide}
                    className="w-12 h-12 md:w-14 md:h-14 bg-black/40 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 md:w-6 md:h-6" />
                </motion.button>
            </div>
            <div className="hidden md:flex absolute bottom-1/2 -translate-y-1/2 right-8 z-20">
                <motion.button
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextSlide}
                    className="w-12 h-12 md:w-14 md:h-14 bg-black/40 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 md:w-6 md:h-6" />
                </motion.button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-3 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-3">
                {hotTopics.map((topic, index) => (
                    <button
                        key={topic.id}
                        onClick={() => goToSlide(index)}
                        className="group relative flex items-center"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <motion.div
                            className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "w-8 md:w-12 bg-white"
                                : "w-4 md:w-6 bg-white/30 group-hover:bg-white/50"
                                }`}
                        />
                    </button>
                ))}
            </div>

            {/* Slide Counter - Hidden on mobile */}
            <div className="hidden md:block absolute bottom-8 md:bottom-12 right-6 md:right-12 z-20">
                <div className="flex items-baseline gap-1 text-white">
                    <span className="text-3xl md:text-4xl font-bold">
                        {String(currentIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/40">/</span>
                    <span className="text-sm text-white/40">
                        {String(hotTopics.length).padStart(2, "0")}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-white/10 z-20">
                <motion.div
                    key={currentIndex}
                    initial={{ width: "0%" }}
                    animate={{ width: isAutoPlaying && !isDragging ? "100%" : "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-white"
                />
            </div>

            {/* Thumbnail Preview - Desktop Only */}
            <div className="hidden lg:flex absolute bottom-24 right-12 z-20 gap-3">
                {hotTopics.map((topic, index) => (
                    <motion.button
                        key={topic.id}
                        onClick={() => goToSlide(index)}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`relative w-20 h-14 rounded-lg overflow-hidden transition-all ${index === currentIndex
                            ? "ring-2 ring-white ring-offset-2 ring-offset-black/50"
                            : "opacity-50 hover:opacity-80"
                            }`}
                    >
                        <Image
                            src={topic.image}
                            alt={topic.title}
                            fill
                            sizes="120px"
                            className="object-cover"
                        />
                    </motion.button>
                ))}
            </div>
        </section>
    );
}
