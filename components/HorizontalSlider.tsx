"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Post } from "@/lib/posts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaOptions } from "@/components/ui/MediaOptions";

interface HorizontalSliderProps {
    articles: Post[];
}

export function HorizontalSlider({ articles }: HorizontalSliderProps) {
    // Ensure we have enough items for a smooth loop (Embla recommendation)
    // If fewer than 10 items, repeat them to fill space and allow seamless looping
    const displayArticles = articles.length > 0 && articles.length < 10
        ? [...articles, ...articles, ...articles] // Triple it to be safe (4 -> 12)
        : articles;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        containScroll: "trimSnaps",
        direction: "ltr",
    });

    // Forced autoplay removed for optimization and consistency

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <div className="relative group mx-auto w-full">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-8">
                    {displayArticles.map((item, index) => (
                        <Link
                            // Use index in key because we might have duplicates now
                            key={`${item.slug}-${index}`}
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
                                <MediaOptions slug={item.slug} hasVideo={!!item.videoUrl} variant="compact" className="mt-2" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={scrollPrev}
                className="absolute left-[-20px] md:left-[-40px] top-1/3 -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 duration-200"
                aria-label="Previous"
            >
                <ChevronLeft className="w-8 h-8 text-text-primary/70 hover:text-accent" />
            </button>

            <button
                onClick={scrollNext}
                className="absolute right-[-20px] md:right-[-40px] top-1/3 -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 duration-200"
                aria-label="Next"
            >
                <ChevronRight className="w-8 h-8 text-text-primary/70 hover:text-accent" />
            </button>

            {/* Pagination Dots (Optional: Added because User's image showed them, keeping for feature parity if desired, or removing to clean up) 
               User's current HorizontalSlider HAD dots. Let's keep them but make them use Embla API. 
            */}
        </div>
    );
}
