"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion, useScroll, useTransform } from "framer-motion";
import { MediaOptions } from "@/components/ui/MediaOptions";

interface ArticleHeaderProps {
    title?: string;
    author?: string;
    date?: string;
    category?: string;
    subtitle?: string;
    coverImage?: string;
    slug?: string;
    videoUrl?: string | null;
}

export function ArticleHeader({
    title = "The Art of Digital Silence",
    author = "Sarah Jenkins",
    date = "Oct 24, 2024",
    category = "Design",
    coverImage,
    slug = "slow-interfaces",
    videoUrl,
}: ArticleHeaderProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    // Use coverImage if provided, otherwise fallback to default
    const heroImage = coverImage || Assets.imgArticleHero;

    return (
        <>
            {/* Mobile Layout - Image on top, content below */}
            <header className="md:hidden relative w-full">
                {/* Hero Image - 55% screen height on mobile */}
                <div className="relative w-full h-[55svh] overflow-hidden">
                    <Image
                        src={heroImage}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Title overlay at bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-6">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-white mb-3"
                            style={{ fontSize: 'clamp(0.5rem, 2vw, 0.625rem)' }}
                        >
                            {category}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="font-serif font-bold text-white leading-tight mb-3 break-words hyphens-auto"
                            style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}
                        >
                            {title}
                        </motion.h1>

                        {/* Media Options - Read, Listen, Watch */}
                        <MediaOptions slug={slug} hasVideo={!!videoUrl && videoUrl.length > 5} variant="prominent" />
                    </div>
                </div>

                {/* Author section below image */}
                <div className="bg-bg-primary px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span
                            className="font-medium text-text-primary"
                            style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}
                        >
                            by {author}
                        </span>
                        <span className="text-text-muted">•</span>
                        <span
                            className="text-text-muted"
                            style={{ fontSize: 'clamp(0.625rem, 2vw, 0.75rem)' }}
                        >
                            {date}
                        </span>
                    </div>
                </div>
            </header>

            {/* Desktop Layout - Left bottom positioned hero */}
            <header className="hidden md:flex relative w-full h-[100vh] overflow-hidden">
                {/* Background Image Parallax */}
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 z-0"
                >
                    <div className="relative w-full h-[120%] -top-[10%]">
                        <Image
                            src={heroImage}
                            alt={title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                </motion.div>

                {/* Title Content - Left Bottom */}
                <div className="relative z-10 w-full h-full flex flex-col justify-end p-12 lg:p-16 pb-20 lg:pb-24">
                    <div className="max-w-4xl space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <span
                                className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.2em] text-white"
                                style={{ fontSize: 'clamp(0.625rem, 1vw, 0.75rem)' }}
                            >
                                {category}
                            </span>
                            <span
                                className="text-white/60"
                                style={{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }}
                            >
                                {date}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="font-serif font-bold text-white leading-tight"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                        >
                            {title}
                        </motion.h1>

                        {/* Author Info - No picture */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex items-center gap-2"
                        >
                            <span
                                className="font-medium text-white"
                                style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
                            >
                                by {author}
                            </span>
                        </motion.div>

                        {/* Media Options - Read, Listen, Watch */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <MediaOptions slug={slug} hasVideo={!!videoUrl && videoUrl.length > 5} variant="overlay" />
                        </motion.div>
                    </div>
                </div>
            </header>
        </>
    );
}
