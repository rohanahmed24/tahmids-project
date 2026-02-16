"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { MobileSlider } from "@/components/ui/MobileSlider";
import { MediaOptions } from "@/components/ui/MediaOptions";
import { useState, useEffect } from "react";
import type { Post } from "@/lib/posts";
import { Assets } from "@/lib/assets";
import { useLocale } from "@/components/providers/LocaleProvider";
import { t } from "@/lib/translations";

interface StoriesGridProps {
    category?: string; // Optional filtering
    categoryLabel?: string;
}

export function StoriesGrid({ category, categoryLabel }: StoriesGridProps) {
    const { locale } = useLocale();
    const router = useRouter();
    const [stories, setStories] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (category) params.set("category", category);
                params.set("limit", "8");
                const res = await fetch(`/api/stories?${params.toString()}`);
                if (!res.ok) throw new Error("Failed to fetch stories");
                const data = (await res.json()) as { stories: Post[] };
                setStories(data.stories || []);
            } catch (error) {
                console.error("Failed to fetch stories", error);
                setStories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [category]);

    if (loading) {
        return (
            <section className="relative w-full py-12 md:py-24 bg-bg-primary">
                <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center text-text-muted">
                    {t(locale, "loadingStories")}
                </div>
            </section>
        );
    }

    if (stories.length === 0) {
        return (
            <section className="relative w-full py-12 md:py-24 bg-bg-primary">
                <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center">
                    <p className="text-text-secondary text-lg">
                        {t(locale, "noStoriesFoundIn")} {categoryLabel || category || t(locale, "thisSection")} {t(locale, "yet")}.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="relative w-full py-12 md:py-24 bg-bg-primary">
            <div className="max-w-[1800px] mx-auto px-6 md:px-12">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-20 text-text-primary">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-50 block mb-4">
                        {category ? t(locale, "curatedStories") : t(locale, "latestStories")}
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-black tracking-tighter">
                        {category ? (categoryLabel || category).toUpperCase() : <>THE <span className="italic font-light">ARCHIVE</span></>}
                    </h2>
                </div>

                {/* Mobile: Draggable Slider */}
                <div className="md:hidden -mx-6 px-6">
                    <MobileSlider autoplayInterval={0} cardWidthPercent={85} gap={12}>
                        {stories.map((story) => (
                            <div
                                key={story.id}
                                onClick={() => router.push(`/article/${story.slug}`)}
                                className="h-[380px] relative group overflow-hidden rounded-2xl bg-bg-card cursor-pointer w-full"
                            >
                                <Image
                                    src={story.coverImage || Assets.imgPlaceholderImage4}
                                    fill
                                    sizes="(max-width: 768px) 85vw, 25vw"
                                    alt={story.title}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[11px] bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white font-bold uppercase tracking-widest border border-white/10">
                                            {story.category}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-serif text-white leading-snug mb-3">
                                            {story.title}
                                        </h3>
                                        <MediaOptions
                                            slug={story.slug}
                                            hasAudio={!!story.audioUrl && story.audioUrl.length > 5}
                                            hasVideo={!!story.videoUrl && story.videoUrl.length > 5}
                                            variant="compact"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </MobileSlider>
                </div>

                {/* Desktop: Bento Grid */}
                <div className="hidden md:grid md:grid-cols-4 auto-rows-[300px] gap-4">
                    {stories.map((story, i) => {
                        // Simple logic to vary sizes based on index
                        const isLarge = i === 0 || i === 7;
                        const isWide = i === 4;
                        const isTall = i === 2;

                        return (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className={`relative group overflow-hidden bg-bg-card
                                    ${isLarge ? 'col-span-2 row-span-2' : ''}
                                    ${isWide ? 'col-span-2' : ''}
                                    ${isTall ? 'row-span-2' : ''}
                                `}
                            >
                                <div
                                    onClick={() => router.push(`/article/${story.slug}`)}
                                    className="block w-full h-full cursor-pointer"
                                >
                                    <Image
                                        src={story.coverImage || Assets.imgPlaceholderImage4}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        alt={story.title}
                                        className="object-cover transition-transform duration-[1s] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white font-bold uppercase tracking-widest border border-white/10">
                                                {story.category}
                                            </span>
                                            <ArrowUpRight className="text-white group-hover:-translate-y-1 transition-transform duration-300" />
                                        </div>

                                        <div>
                                            <h3 className={`font-serif text-white leading-tight mb-3
                                                ${isLarge ? 'text-3xl md:text-4xl' : 'text-xl'}
                                            `}>
                                                {story.title}
                                            </h3>
                                            <MediaOptions
                                                slug={story.slug}
                                                hasAudio={!!story.audioUrl && story.audioUrl.length > 5}
                                                hasVideo={!!story.videoUrl && story.videoUrl.length > 5}
                                                variant="compact"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-center mt-20">
                    <button className="text-xs font-bold uppercase tracking-[0.2em] border border-border-subtle px-8 py-4 text-text-primary hover:bg-black hover:text-white hover:border-black transition-all">
                        {t(locale, "loadMoreStories")}
                    </button>
                </div>
            </div>
        </section>
    );
}
