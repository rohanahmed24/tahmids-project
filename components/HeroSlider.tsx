"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion, AnimatePresence } from "framer-motion";
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

    // Auto-slide
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

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
            className="relative w-full h-screen overflow-hidden bg-black"
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
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${currentTopic.accent} mix-blend-multiply opacity-60`} />
                </motion.div>
            </AnimatePresence>

            {/* Hot Topics Badge */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-24 md:top-32 left-6 md:left-12 z-20"
            >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                    <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white">
                        Hot Topics
                    </span>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="absolute inset-0 flex items-end z-10">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
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
                                className="inline-block text-xs md:text-sm font-bold uppercase tracking-widest text-white/80 mb-4"
                            >
                                {currentTopic.category}
                            </motion.span>

                            {/* Title */}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-4">
                                {currentTopic.title}
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl">
                                {currentTopic.subtitle}
                            </p>

                            {/* CTA Buttons */}
                            <MediaOptions slug={currentTopic.slug} variant="overlay" />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-1/2 translate-y-1/2 left-4 md:left-8 z-20">
                <motion.button
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevSlide}
                    className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
            </div>
            <div className="absolute bottom-1/2 translate-y-1/2 right-4 md:right-8 z-20">
                <motion.button
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextSlide}
                    className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                {hotTopics.map((topic, index) => (
                    <button
                        key={topic.id}
                        onClick={() => goToSlide(index)}
                        className="group relative flex items-center"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <motion.div
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "w-12 bg-white"
                                : "w-6 bg-white/30 group-hover:bg-white/50"
                                }`}
                        />
                    </button>
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute bottom-8 md:bottom-12 right-6 md:right-12 z-20">
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
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
                <motion.div
                    key={currentIndex}
                    initial={{ width: "0%" }}
                    animate={{ width: isAutoPlaying ? "100%" : "0%" }}
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
                            className="object-cover"
                        />
                    </motion.button>
                ))}
            </div>
        </section>
    );
}
