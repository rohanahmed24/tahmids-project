"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function Hero() {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            volume: "ভলিউম ২৪ — সংস্করণ ০৯",
            titleTop: "ডিজিটাল",
            titleBottom: "নীরবতার শিল্প",
            body: "ধারাবাহিক শব্দের যুগে মিনিমালিজমের নতুন ঢেউ।",
            readStory: "গল্প পড়ুন",
            editorsNote: "— সম্পাদকীয় নোট",
            scroll: "স্ক্রল",
            editorialHero: "এডিটোরিয়াল হিরো",
            secondaryFeature: "সেকেন্ডারি ফিচার",
        }
        : {
            volume: "Vol. 24 — Edit. 09",
            titleTop: "The Art of",
            titleBottom: "Digital Silence",
            body: "Exploring the new wave of minimalism in an era of constant noise.",
            readStory: "Read Story",
            editorsNote: "— Editor's Note",
            scroll: "Scroll",
            editorialHero: "Editorial Hero",
            secondaryFeature: "Secondary Feature",
        };
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const textY = useTransform(scrollY, [0, 300], [0, 100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="relative w-full min-h-screen md:min-h-[110vh] overflow-hidden bg-base text-main">
            {/* Background Text (Parallax) - Hidden on mobile */}
            <motion.div
                style={{ y: textY, opacity }}
                className="hidden md:flex absolute inset-0 items-center justify-center z-0 pointer-events-none select-none"
            >
                <h1 className="text-[18vw] leading-none font-serif font-black text-main/5 tracking-tighter text-center whitespace-nowrap">
                    WISDOMIA
                </h1>
            </motion.div>

            {/* Mobile Layout */}
            <div className="md:hidden relative z-10 flex flex-col min-h-screen">
                {/* Mobile Hero Image */}
                <div className="relative w-full h-[55vh] mt-20">
                    <Image
                        src={Assets.imgPlaceholderImage7}
                        alt={copy.editorialHero}
                        fill
                        sizes="(max-width: 768px) 100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent" />
                </div>

                {/* Mobile Content */}
                <div className="relative -mt-16 px-6 pb-8 flex flex-col items-center text-center space-y-5">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">{copy.volume}</span>
                    <h2 className="text-4xl font-serif leading-tight">
                        {copy.titleTop}<br />
                        <span className="italic text-accent">{copy.titleBottom}</span>
                    </h2>
                    <p className="text-sm opacity-70 leading-relaxed max-w-[280px]">
                        {copy.body}
                    </p>
                    <button className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-border-subtle px-6 py-3 rounded-full active:scale-95 transition-transform">
                        {copy.readStory}
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid relative z-10 w-full h-full max-w-[1800px] mx-auto grid-cols-12 gap-4 px-12 pt-32 pb-12">

                {/* Left Column: Editorial Text */}
                <div className="col-span-3 flex flex-col justify-end pb-32 space-y-6">
                    <div className="w-12 h-[1px] bg-text-primary/30 mb-4"></div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-60">{copy.volume}</p>
                    <h2 className="text-4xl font-serif leading-tight">
                        {copy.titleTop} <br />
                        <span className="italic text-accent">{copy.titleBottom}</span>
                    </h2>
                    <p className="text-sm opacity-70 leading-relaxed max-w-[250px]">
                        {copy.body}
                    </p>
                    <button className="group w-fit text-xs font-bold uppercase tracking-widest border-b border-text-primary pb-1 hover:opacity-50 transition-opacity mt-4 flex items-center gap-2">
                        {copy.readStory}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Center: Main Hero Image (Parallax) */}
                <motion.div
                    style={{ y: y1 }}
                    className="col-span-5 h-[80vh] relative mt-20"
                >
                    <div className="relative w-full h-full overflow-hidden" style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)" }}>
                        <Image
                                src={Assets.imgPlaceholderImage7}
                                alt={copy.editorialHero}
                            fill
                            sizes="50vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                </motion.div>

                {/* Right Column: Secondary Image & Details */}
                <motion.div
                    style={{ y: y2 }}
                    className="col-span-4 flex flex-col pt-40 pl-12 space-y-8"
                >
                    <div className="relative w-full aspect-[3/4] max-w-[300px]">
                        <div className="relative w-full h-full overflow-hidden" style={{ clipPath: "polygon(0 15%, 100% 0, 100% 100%, 0% 100%)" }}>
                            <Image
                                src={Assets.imgPlaceholderImage5}
                                alt={copy.secondaryFeature}
                                fill
                                sizes="33vw"
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 z-20">
                            <span className="block text-6xl font-serif font-black text-transparent stroke-text-primary opacity-20">01</span>
                        </div>
                    </div>

                    <div className="max-w-[280px]">
                        <p className="font-serif italic text-2xl leading-snug">
                            &quot;Fashion is not just about clothes, it&apos;s about a clear mind.&quot;
                        </p>
                        <p className="text-xs mt-4 font-bold tracking-widest uppercase opacity-50">{copy.editorsNote}</p>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator - Desktop only */}
            <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-50">
                <span className="text-[10px] uppercase tracking-widest">{copy.scroll}</span>
                <div className="w-[1px] h-12 bg-current animate-pulse"></div>
            </div>
        </section>
    );
}
