"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { MediaOptions } from "@/components/ui/MediaOptions";
import { Post } from "@/lib/posts";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";

interface HeroSliderProps {
    items: Post[];
}

export function HeroSlider({ items }: HeroSliderProps) {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            welcome: "Wisdomia-তে স্বাগতম",
            source: "চিরন্তন প্রজ্ঞার",
            source2: "আপনার ঠিকানা",
            discover: "ভাবনাকে নাড়া দেয় এমন লেখা, অন্তর্দৃষ্টি ও গল্প আবিষ্কার করুন।",
            hotTopics: "গরম বিষয়",
            heroHighlights: "প্রধান হাইলাইটস",
            previousSlide: "পূর্বের স্লাইড",
            nextSlide: "পরের স্লাইড",
        }
        : {
            welcome: "Welcome to Wisdomia",
            source: "Your Source for",
            source2: "Timeless Wisdom",
            discover: "Discover thought-provoking articles, insights, and stories that inspire and enlighten.",
            hotTopics: "Hot Topics",
            heroHighlights: "Hero Highlights",
            previousSlide: "Previous slide",
            nextSlide: "Next slide",
        };

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20 }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    // Filter mainly ensuring we have items, fallback to empty array if undefined
    const validItems = items || [];

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    if (validItems.length === 0) {
        return (
            <section className="relative w-full h-[50vh] md:h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
                <div className="absolute inset-0 bg-[url('/imgs/pattern.svg')] opacity-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <div className="flex items-center gap-2 bg-orange-500/80 backdrop-blur-md rounded-full px-4 py-2 mb-6">
                        <Flame className="w-4 h-4 text-white" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white">
                            {copy.welcome}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-4 max-w-4xl">
                        {copy.source} <span className="italic text-purple-300">{copy.source2}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                        {copy.discover}
                    </p>
                </div>
            </section>
        );
    }

    const currentTopic = validItems[selectedIndex];

    return (
        <section
            className="relative w-full h-[50vh] md:h-screen overflow-hidden bg-black group"
            onMouseEnter={() => {
                emblaApi?.plugins().autoplay?.stop();
            }}
            onMouseLeave={() => {
                emblaApi?.plugins().autoplay?.play();
            }}
            role="region"
            aria-roledescription="carousel"
            aria-label={copy.heroHighlights}
        >
            {/* Embla Carousel Viewport */}
            <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full touch-pan-y">
                    {validItems.map((item, index) => (
                        <div key={item.slug} className="relative flex-[0_0_100%] min-w-0 h-full">
                            <Image
                                src={item.coverImage || '/placeholder.jpg'}
                                alt={item.title}
                                fill
                                sizes="100vw"
                                quality={85}
                                className="object-cover"
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.accent_color || 'from-blue-600/30 to-purple-600/30'} mix-blend-soft-light opacity-50`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Hot Topics Badge - Desktop only */}
            <div
                className="hidden md:block absolute top-32 left-12 z-20"
            >
                <div className="flex items-center gap-2 bg-orange-500/80 backdrop-blur-md rounded-full px-3 py-1.5 md:px-4 md:py-2">
                    <Flame className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white">
                        {copy.hotTopics}
                    </span>
                </div>
            </div>

            {/* Main Content - At bottom on mobile */}
            <div className="absolute inset-0 flex items-end z-10 pointer-events-none">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-12 pb-16 md:pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-3xl pointer-events-auto"
                        >
                            {/* Title */}
                            <h1
                                className="font-serif font-bold text-white leading-tight mb-6 md:mb-8"
                                style={{ fontSize: 'clamp(1.25rem, 5vw, 4.5rem)' }}
                            >
                                {currentTopic.title}
                            </h1>

                            {/* CTA Buttons - Compact on mobile, full on desktop */}
                            <div className="mt-4 md:mt-0">
                                <MediaOptions slug={currentTopic.slug} hasVideo={!!currentTopic.videoUrl && currentTopic.videoUrl.length > 5} variant="prominent" className="md:hidden" />
                                <MediaOptions slug={currentTopic.slug} hasVideo={!!currentTopic.videoUrl && currentTopic.videoUrl.length > 5} variant="overlay" className="hidden md:flex" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Arrows - Desktop only */}
            <button
                onClick={scrollPrev}
                className="hidden md:flex absolute bottom-1/2 -translate-y-1/2 left-8 z-20 w-12 h-12 md:w-14 md:h-14 bg-black/40 backdrop-blur-md border border-white/30 rounded-full items-center justify-center text-white hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100 duration-300"
                aria-label={copy.previousSlide}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={scrollNext}
                className="hidden md:flex absolute bottom-1/2 -translate-y-1/2 right-8 z-20 w-12 h-12 md:w-14 md:h-14 bg-black/40 backdrop-blur-md border border-white/30 rounded-full items-center justify-center text-white hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100 duration-300"
                aria-label={copy.nextSlide}
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-3 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex lg:hidden items-center gap-2 md:gap-3 pointer-events-auto">
                {validItems.map((topic, index) => (
                    <button
                        key={topic.slug}
                        onClick={() => scrollTo(index)}
                        className={`w-[4px] h-[4px] !p-0 rounded-full transition-all duration-300 ${index === selectedIndex
                            ? "bg-white"
                            : "bg-white/30"
                            }`}
                        aria-label={locale === "bn" ? `স্লাইড ${index + 1} এ যান` : `Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Slide Counter - Hidden on mobile */}
            <div className="hidden md:block absolute bottom-8 md:bottom-12 right-6 md:right-12 z-20">
                <div className="flex items-baseline gap-1 text-white">
                    <span className="text-3xl md:text-4xl font-bold">
                        {String(selectedIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/40">/</span>
                    <span className="text-sm text-white/40">
                        {String(validItems.length).padStart(2, "0")}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-white/10 z-20">
                <div
                    className="h-full bg-white transition-[width] ease-linear duration-100" // using js for progress might be smoother but this is okay
                    style={{ width: `${((selectedIndex + 1) / validItems.length) * 100}%` }}
                />
            </div>

            {/* Thumbnail Preview - Desktop Only */}
            <div className="hidden lg:flex absolute bottom-12 left-0 right-0 justify-center z-20 gap-3 pointer-events-auto">
                {validItems.map((topic, index) => (
                    <button
                        key={topic.slug}
                        onClick={() => scrollTo(index)}
                        className={`relative w-20 h-14 rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:scale-105 ${index === selectedIndex
                            ? "ring-2 ring-white ring-offset-2 ring-offset-black/50"
                            : "opacity-50 hover:opacity-80"
                            }`}
                        aria-label={locale === "bn" ? `স্লাইড ${index + 1} এ যান` : `Go to slide ${index + 1}`}
                    >
                        <Image
                            src={topic.coverImage || '/placeholder.jpg'}
                            alt={topic.title}
                            fill
                            sizes="120px"
                            className="object-cover"
                            loading="lazy"
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
