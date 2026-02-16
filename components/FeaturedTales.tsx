"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { DecorativeBackgrounds } from "@/components/ui/DecorativeBackgrounds";
import { MediaOptions } from "@/components/ui/MediaOptions";
import { Post } from "@/lib/posts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

// Desktop Horizontal Slider Component using Embla
function FeaturedHorizontalSlider({ items, previousLabel, nextLabel }: { items: Post[]; previousLabel: string; nextLabel: string }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
        dragFree: true, // Allows smooth dragging
        containScroll: "trimSnaps",
    });

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <div className="relative group mx-auto max-w-[1472px]">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {items.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/article/${item.slug}`}
                            className="flex-shrink-0 group relative w-[350px]"
                        >
                            <div className="relative aspect-[16/9] overflow-hidden mb-4 rounded-lg">
                                <Image
                                    src={item.coverImage || '/placeholder.jpg'}
                                    fill
                                    sizes="350px"
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
                                <h3 className="font-serif leading-tight group-hover:underline decoration-1 underline-offset-4 text-text-primary line-clamp-3 text-base">
                                    {item.title}
                                </h3>
                                <MediaOptions
                                    slug={item.slug}
                                    hasAudio={!!item.audioUrl && item.audioUrl.length > 5}
                                    hasVideo={!!item.videoUrl && item.videoUrl.length > 5}
                                    variant="compact"
                                    className="mt-2"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/3 -translate-y-1/2 w-12 h-12 bg-bg-card/90 hover:bg-bg-card rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                aria-label={previousLabel}
            >
                <ChevronLeft className="w-6 h-6 text-text-primary" />
            </button>

            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/3 -translate-y-1/2 w-12 h-12 bg-bg-card/90 hover:bg-bg-card rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                aria-label={nextLabel}
            >
                <ChevronRight className="w-6 h-6 text-text-primary" />
            </button>
        </div>
    );
}

interface FeaturedTalesProps {
    articles: Post[];
}

export function FeaturedTales({ articles = [] }: FeaturedTalesProps) {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? { latest: "সর্বশেষ", articles: "লেখা", previous: "পূর্বের", next: "পরের", mobileLabel: "মোবাইলে সর্বশেষ লেখা" }
        : { latest: "Latest", articles: "Articles", previous: "Previous", next: "Next", mobileLabel: "Latest Articles Mobile" };

    // Mobile Slider
    const [mobileRef, mobileApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps"
    });

    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!mobileApi) return;
        setSelectedIndex(mobileApi.selectedScrollSnap());
    }, [mobileApi]);

    useEffect(() => {
        if (!mobileApi) return;
        onSelect();
        mobileApi.on("select", onSelect);
    }, [mobileApi, onSelect]);

    const scrollTo = useCallback((index: number) => mobileApi && mobileApi.scrollTo(index), [mobileApi]);

    // Split items for desktop
    const half = Math.ceil(articles.length / 2);
    const topRowItems = articles.slice(0, half);
    const bottomRowItems = articles.slice(half, articles.length);

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
                        {copy.latest} <span className="italic font-light opacity-60">{copy.articles}</span>
                    </h2>
                </div>

                {/* Mobile: Embla Slider */}
                <div className="md:hidden relative" role="region" aria-roledescription="carousel" aria-label={copy.mobileLabel}>
                    <div className="overflow-hidden" ref={mobileRef}>
                        <div className="flex gap-3">
                            {articles.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/article/${item.slug}`}
                                    className="flex-shrink-0 w-[85vw] sm:w-[50vw] relative"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-2">
                                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-600/90 text-[8px] uppercase font-bold tracking-wider text-white rounded z-20">
                                            {item.category}
                                        </span>
                                        <Image
                                            src={item.coverImage || '/placeholder.jpg'}
                                            fill
                                            sizes="(max-width: 768px) 85vw, 350px"
                                            alt={item.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    </div>
                                    <h3 className="text-sm font-serif leading-tight text-text-primary line-clamp-2 mb-1">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-[10px] text-text-muted">
                                        <span className="text-accent">●</span>
                                        <span>{item.author}</span>
                                        <span>·</span>
                                        <span>{item.date}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Pagination Dots */}
                    <div className="flex justify-center gap-1.5 mt-4">
                        {articles.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`w-2.5 h-2.5 !p-0 rounded-full border transition-all duration-300 ${index === selectedIndex
                                    ? "bg-accent border-accent scale-110"
                                    : "bg-text-muted/20 border-text-muted/40 hover:bg-text-muted/35"
                                    }`}
                                aria-label={locale === "bn" ? `স্লাইড ${index + 1} এ যান` : `Go to slide ${index + 1}`}
                                aria-current={index === selectedIndex ? "true" : "false"}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: 2 Horizontal Sliders */}
                <div className="hidden md:block space-y-12">
                    <FeaturedHorizontalSlider items={topRowItems} previousLabel={copy.previous} nextLabel={copy.next} />
                    <FeaturedHorizontalSlider items={bottomRowItems} previousLabel={copy.previous} nextLabel={copy.next} />
                </div>
            </div>
        </section>
    );
}
