"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { DecorativeBackgrounds } from "@/components/ui/DecorativeBackgrounds";
import { MobileSlider } from "@/components/ui/MobileSlider";
import { MediaOptions } from "@/components/ui/MediaOptions";

const breakingNews = [
    { id: "01", category: "Technology", title: "The quiet revolution of slow interfaces", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces" },
    { id: "02", category: "Culture", title: "Why we need less information, not more", img: Assets.imgPlaceholderImage2, slug: "less-information" },
    { id: "03", category: "Philosophy", title: "Building a digital garden for the mind", img: Assets.imgPlaceholderImage3, slug: "digital-garden" },
    { id: "04", category: "Future", title: "Life on Mars: A Reality?", img: Assets.imgPlaceholderImage4, slug: "slow-interfaces" }, // Fallback to existing
];

export function FeaturedTales() {
    return (
        <section className="relative w-full py-24 bg-bg-primary overflow-hidden">
            <DecorativeBackgrounds />

            <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
                {/* Section Header */}
                <div className="flex justify-between items-end mb-16 border-b border-border-subtle pb-6">
                    <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-text-primary">
                        Trending <span className="italic font-light opacity-60">Now</span>
                    </h2>
                    <Link href="/stories" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-primary hover:opacity-50 transition-opacity pb-2 px-2 -mr-2">
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Mobile: Draggable Slider with Autoplay */}
                <div className="md:hidden -mx-6 px-6">
                    <MobileSlider autoplayInterval={3500} cardWidth={260} gap={12}>
                        {breakingNews.map((item) => (
                            <Link
                                key={item.id}
                                href={`/article/${item.slug}`}
                                className="block"
                                style={{ width: '260px', minWidth: '260px' }}
                            >
                                <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-xl">
                                    <span className="absolute top-3 left-3 text-3xl font-serif text-white z-20 opacity-80 drop-shadow-lg">{item.id}</span>
                                    <Image
                                        src={item.img}
                                        fill
                                        alt={item.title}
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20" />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[11px] uppercase font-bold tracking-widest text-accent">{item.category}</span>
                                    <h3 className="text-base font-serif leading-snug text-text-primary">{item.title}</h3>
                                    <MediaOptions slug={item.slug} variant="compact" className="mt-2" />
                                </div>
                            </Link>
                        ))}
                    </MobileSlider>
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
