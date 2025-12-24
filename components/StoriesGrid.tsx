"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileSlider } from "@/components/ui/MobileSlider";
import { MediaOptions } from "@/components/ui/MediaOptions";


const stories = [
    { id: 1, title: "Empires that ruled then vanished into dust", category: "History", img: Assets.imgStoryHistory, size: "large", slug: "slow-interfaces", topicSlug: null },
    { id: 2, title: "Decisions that bent the course of human history", category: "Politics", img: Assets.imgStoryPolitics, size: "small", slug: "less-information", topicSlug: null },
    { id: 3, title: "Game that held the world in their grip", category: "Crime", img: Assets.imgStoryCrime, size: "tall", slug: "digital-garden", topicSlug: null },
    { id: 4, title: "Traditions that outlived the people who made them", category: "Culture", img: Assets.imgStoryCulture, size: "small", slug: "remote-work", topicSlug: "design-culture" },
    { id: 5, title: "The Psychology of Color in Film", category: "Art", img: Assets.imgStoryArt, size: "wide", slug: "creative-process", topicSlug: "design-culture" },
    { id: 6, title: "Why We Dream: The Science of Sleep", category: "Science", img: Assets.imgStoryScience, size: "small", slug: "science-sleep", topicSlug: "psychology" },
    { id: 7, title: "The Ethics of Artificial Intelligence", category: "Technology", img: Assets.imgArticleAiEthics, size: "large", slug: "ai-ethics", topicSlug: "technology-ai" },
    { id: 8, title: "Cities of Tomorrow: Reimagining Urban Life", category: "Future Tech", img: Assets.imgArticleFutureCities, size: "wide", slug: "future-cities", topicSlug: "future-tech" },
    { id: 9, title: "The Art of Mindful Living", category: "Psychology", img: Assets.imgPlaceholderImage4, size: "small", slug: "mindful-living", topicSlug: "psychology" },
    { id: 10, title: "The Philosophy of Simplicity", category: "Minimalism", img: Assets.imgPlaceholderImage5, size: "tall", slug: "philosophy-simplicity", topicSlug: "minimalism" },
    { id: 11, title: "Typography That Speaks", category: "Design", img: Assets.imgPlaceholderImage3, size: "small", slug: "typography-speaks", topicSlug: "design-culture" },
    { id: 12, title: "The Rise of Slow Media", category: "Culture", img: Assets.imgPlaceholderImage6, size: "small", slug: "slow-media", topicSlug: "design-culture" },
];


export function StoriesGrid() {
    const router = useRouter();

    return (
        <section className="relative w-full py-12 md:py-24 bg-bg-primary">
            {/* <DecorativeBackgrounds />  Let's keep this clean for the grid section */}

            <div className="max-w-[1800px] mx-auto px-6 md:px-12">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-20 text-text-primary">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-50 block mb-4">Latest Stories</span>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-black tracking-tighter">
                        THE <span className="italic font-light">ARCHIVE</span>
                    </h2>
                </div>

                {/* Mobile: Draggable Slider (No autoplay/marquee - fully manual) */}
                <div className="md:hidden -mx-6 px-6">
                    <MobileSlider autoplayInterval={0} cardWidthPercent={85} gap={12}>
                        {stories.slice(0, 8).map((story) => (
                            <div
                                key={story.id}
                                onClick={() => router.push(`/article/${story.slug}`)}
                                className="h-[380px] relative group overflow-hidden rounded-2xl bg-bg-card cursor-pointer w-full"
                            >
                                <Image
                                    src={story.img}
                                    fill
                                    sizes="(max-width: 768px) 85vw, 25vw"
                                    alt={story.title}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        {story.topicSlug ? (
                                            <Link
                                                href={`/topics/${story.topicSlug}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-[11px] bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white font-bold uppercase tracking-widest border border-white/10"
                                            >
                                                {story.category}
                                            </Link>
                                        ) : (
                                            <span className="text-[11px] bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white font-bold uppercase tracking-widest border border-white/10">
                                                {story.category}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-serif text-white leading-snug mb-3">
                                            {story.title}
                                        </h3>
                                        <MediaOptions slug={story.slug} variant="compact" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </MobileSlider>
                </div>

                {/* Desktop: Bento Grid */}
                <div className="hidden md:grid md:grid-cols-4 auto-rows-[300px] gap-4">
                    {stories.map((story, i) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            viewport={{ once: true }}
                            className={`relative group overflow-hidden bg-bg-card
                                ${story.size === 'large' ? 'col-span-2 row-span-2' : ''}
                                ${story.size === 'wide' ? 'col-span-2' : ''}
                                ${story.size === 'tall' ? 'row-span-2' : ''}
                                ${story.size === 'small' ? 'col-span-1' : ''}
                            `}
                        >
                            <div
                                onClick={() => router.push(`/article/${story.slug}`)}
                                className="block w-full h-full cursor-pointer"
                            >
                                <Image
                                    src={story.img}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    alt={story.title}
                                    className="object-cover transition-transform duration-[1s] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        {story.topicSlug ? (
                                            <Link
                                                href={`/topics/${story.topicSlug}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white font-bold uppercase tracking-widest border border-white/10 hover:bg-white/40 transition-colors z-10"
                                            >
                                                {story.category}
                                            </Link>
                                        ) : (
                                            <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white font-bold uppercase tracking-widest border border-white/10">
                                                {story.category}
                                            </span>
                                        )}
                                        <ArrowUpRight className="text-white group-hover:-translate-y-1 transition-transform duration-300" />
                                    </div>

                                    <div>
                                        <h3 className={`font-serif text-white leading-tight mb-3
                                            ${story.size === 'large' ? 'text-3xl md:text-4xl' : 'text-xl'}
                                        `}>
                                            {story.title}
                                        </h3>
                                        <MediaOptions slug={story.slug} variant="compact" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center mt-20">
                    <button className="text-xs font-bold uppercase tracking-[0.2em] border border-border-subtle px-8 py-4 text-text-primary hover:bg-black hover:text-white hover:border-black transition-all">
                        Load More Stories
                    </button>
                </div>
            </div>
        </section>
    );
}
