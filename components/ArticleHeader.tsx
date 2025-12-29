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
}

export function ArticleHeader({
    title = "The Art of Digital Silence",
    author = "Sarah Jenkins",
    date = "Oct 24, 2024",
    category = "Design",
}: ArticleHeaderProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <>
            {/* Mobile Layout - Image on top, content below */}
            <header className="md:hidden relative w-full">
                {/* Hero Image - 55% screen height on mobile */}
                <div className="relative w-full h-[55svh] overflow-hidden">
                    <Image
                        src={Assets.imgArticleHero}
                        alt="Article Cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Title overlay at bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl font-serif font-bold text-white leading-tight mb-3"
                        >
                            {title}
                        </motion.h1>

                        {/* Media Options - Read, Listen, Watch */}
                        <MediaOptions slug="slow-interfaces" variant="prominent" />
                    </div>
                </div>

                {/* Author section below image */}
                <div className="bg-bg-primary px-4 py-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bg-tertiary overflow-hidden relative border-2 border-border-subtle">
                            <Image src={Assets.imgAuthorSarah} alt="Author" fill sizes="40px" className="object-cover" />
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-text-primary">by {author}</span>
                        </div>
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
                            src={Assets.imgArticleHero}
                            alt="Article Cover"
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>
                </motion.div>

                {/* Title Content - Left Bottom */}
                <div className="relative z-10 w-full h-full flex flex-col justify-end p-12 lg:p-16">
                    <div className="max-w-4xl space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white">
                                {category}
                            </span>
                            <span className="text-white/60 text-sm">{date}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-5xl lg:text-7xl font-serif font-bold text-white leading-tight"
                        >
                            {title}
                        </motion.h1>


                        {/* Media Options - Read, Listen, Watch */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <MediaOptions slug="slow-interfaces" variant="overlay" />
                        </motion.div>
                    </div>
                </div>
            </header>
        </>
    );
}
