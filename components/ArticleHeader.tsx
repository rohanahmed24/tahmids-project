"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";

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
    subtitle = "Revisiting the dark and terrifying witch hunts that tore through 17th-century Massachusetts."
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
                        priority
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
                        <p className="text-sm text-white/80 leading-relaxed mb-4">
                            {subtitle}
                        </p>

                        {/* Watch Video Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Watch Video
                        </motion.button>
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

            {/* Desktop Layout - Original parallax hero */}
            <header className="hidden md:flex relative w-full h-[85vh] items-end justify-center overflow-hidden pb-20">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                </motion.div>

                {/* Title Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center gap-4"
                    >
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-white">
                            {category}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium leading-[0.95] tracking-tighter"
                    >
                        {title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm font-sans"
                    >
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm pr-6 pl-2 py-2 rounded-full border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden relative">
                                <Image src={Assets.imgAuthorSarah} alt="Author" fill sizes="40px" className="object-cover" />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold uppercase tracking-wide text-xs">{author}</span>
                                <span className="block text-[10px] opacity-70 uppercase tracking-widest">Editor in Chief</span>
                            </div>
                        </div>

                        <div className="flex gap-8 opacity-80 font-medium tracking-wide">
                            <span>{date}</span>
                            <span>8 min read</span>
                        </div>
                    </motion.div>
                </div>
            </header>
        </>
    );
}
