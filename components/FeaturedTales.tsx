"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";
import { DecorativeBackgrounds } from "@/components/ui/DecorativeBackgrounds";
import { MediaOptions } from "@/components/ui/MediaOptions";

const breakingNews = [
    { id: "01", category: "Technology", title: "The quiet revolution of slow interfaces", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces" },
    { id: "02", category: "Culture", title: "Why we need less information, not more", img: Assets.imgPlaceholderImage2, slug: "less-information" },
    { id: "03", category: "Philosophy", title: "Building a digital garden for the mind", img: Assets.imgPlaceholderImage3, slug: "digital-garden" },
    { id: "04", category: "Future", title: "Life on Mars: A Reality?", img: Assets.imgPlaceholderImage4, slug: "slow-interfaces" },
];

export function FeaturedTales() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + breakingNews.length) % breakingNews.length);
    }, []);

    const currentItem = breakingNews[currentIndex];

    return (
        <section className="relative w-full py-6 md:py-24 bg-bg-primary overflow-hidden">
            <DecorativeBackgrounds />

            <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
                {/* Section Header - Compact on mobile */}
                <div className="flex justify-between items-center mb-4 md:mb-16 border-b border-border-subtle pb-3 md:pb-6">
                    <h2 className="text-xl md:text-6xl font-serif font-medium tracking-tight text-text-primary">
                        Trending <span className="italic font-light opacity-60">Now</span>
                    </h2>
                    <Link href="/stories" className="group flex items-center gap-1 text-xs md:text-sm font-bold uppercase tracking-widest text-text-primary hover:opacity-50 transition-opacity">
                        View All
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Mobile: Single Card Slider with Arrows and Pagination */}
                <div className="md:hidden relative">
                    {/* Slide Content */}
                    <div className="relative overflow-hidden rounded-xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link href={`/article/${currentItem.slug}`} className="block">
                                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                                        <span className="absolute top-2 left-2 text-xl font-serif text-white z-20 opacity-80 drop-shadow-lg">{currentItem.id}</span>
                                        <Image
                                            src={currentItem.img}
                                            fill
                                            alt={currentItem.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-2 left-2 right-2 z-10">
                                            <span className="text-[9px] uppercase font-bold tracking-widest text-white/80">{currentItem.category}</span>
                                            <h3 className="text-sm font-serif leading-snug text-white line-clamp-2">{currentItem.title}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white z-20"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white z-20"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-1.5 mt-3">
                        {breakingNews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? "bg-accent w-4"
                                        : "bg-text-muted/30 hover:bg-text-muted/50"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: Horizontal Scroll */}
                <div className="hidden md:flex gap-8 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory scroll-smooth">
                    {breakingNews.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="min-w-[400px] snap-start group cursor-pointer"
                        >
                            <Link href={`/article/${item.slug}`}>
                                <div className="relative aspect-[3/4] overflow-hidden mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-700">
                                    <span className="absolute top-4 left-4 text-4xl font-serif text-white z-20 opacity-80 drop-shadow-lg">{item.id}</span>
                                    <Image
                                        src={item.img}
                                        fill
                                        alt={item.title}
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">{item.category}</span>
                                    <h3 className="text-2xl font-serif leading-none group-hover:underline decoration-1 underline-offset-4 text-text-primary">{item.title}</h3>
                                    <MediaOptions slug={item.slug} variant="compact" className="mt-3" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

