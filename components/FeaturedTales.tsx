"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { DecorativeBackgrounds } from "@/components/ui/DecorativeBackgrounds";
import { MediaOptions } from "@/components/ui/MediaOptions";

const breakingNews = [
    { id: "01", category: "History", title: "The Rise of Hitler: How a Failed Artist Became a Dictator", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "John Doe", date: "1 week ago" },
    { id: "02", category: "Mystery", title: "The Amityville Horror: The Terrifying True Story Behind", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "Jane Smith", date: "2 days ago" },
    { id: "03", category: "Philosophy", title: "Building a digital garden for the mind", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Mike Johnson", date: "3 days ago" },
    { id: "04", category: "Future", title: "Life on Mars: A Reality Check", img: Assets.imgPlaceholderImage4, slug: "slow-interfaces", author: "Sarah Lee", date: "5 days ago" },
];

export function FeaturedTales() {
    const [currentPage, setCurrentPage] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const cardsPerPage = 2;
    const gap = 12;
    const totalPages = Math.ceil(breakingNews.length / cardsPerPage);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cardWidth = containerWidth > 0 ? (containerWidth - gap) / 2 : 150;
    const slideWidth = containerWidth;
    const maxDrag = -slideWidth * (totalPages - 1);

    const snapToPage = (page: number) => {
        const targetX = -page * slideWidth;
        animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
        setCurrentPage(page);
    };

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const threshold = slideWidth / 4;

        let newPage = currentPage;
        if (offset < -threshold || velocity < -500) {
            newPage = Math.min(currentPage + 1, totalPages - 1);
        } else if (offset > threshold || velocity > 500) {
            newPage = Math.max(currentPage - 1, 0);
        }
        snapToPage(newPage);
    };

    // Autoslide every 2 seconds
    useEffect(() => {
        if (containerWidth === 0) return;

        const timer = setInterval(() => {
            setCurrentPage(prev => {
                const next = (prev + 1) % totalPages;
                const targetX = -next * slideWidth;
                animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
                return next;
            });
        }, 2000);

        return () => clearInterval(timer);
    }, [containerWidth, slideWidth, totalPages, x]);

    return (
        <section className="relative w-full pt-8 pb-4 md:py-24 bg-bg-primary overflow-hidden">
            <DecorativeBackgrounds />

            <div className="max-w-[1800px] mx-auto px-4 md:px-12 relative z-10">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-3 md:mb-16">
                    <h2 className="text-lg md:text-6xl font-serif font-medium tracking-tight text-text-primary">
                        Latest <span className="italic font-light opacity-60">Articles</span>
                    </h2>
                </div>

                {/* Mobile: 2 Cards Side by Side Draggable Slider */}
                <div className="md:hidden relative" ref={containerRef}>
                    <div className="overflow-hidden">
                        <motion.div
                            className="flex"
                            style={{ x, gap: `${gap}px` }}
                            drag="x"
                            dragConstraints={{ left: maxDrag, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={handleDragEnd}
                        >
                            {breakingNews.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/article/${item.slug}`}
                                    className="flex-shrink-0"
                                    style={{ width: cardWidth }}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-2">
                                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-600/90 text-[8px] uppercase font-bold tracking-wider text-white rounded z-20">
                                            {item.category}
                                        </span>
                                        <Image
                                            src={item.img}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            alt={item.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    </div>
                                    <h3 className="text-xs font-serif leading-tight text-text-primary line-clamp-3 mb-1">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-[9px] text-text-muted">
                                        <span className="text-accent">●</span>
                                        <span>{item.author}</span>
                                        <span>·</span>
                                        <span>{item.date}</span>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </div>



                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-1.5 mt-3">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => snapToPage(index)}
                                className={`h-1.5 rounded-full transition-all ${index === currentPage
                                    ? "bg-accent w-4"
                                    : "bg-text-muted/30 w-1.5 hover:bg-text-muted/50"
                                    }`}
                                aria-label={`Go to page ${index + 1}`}
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
                                        sizes="400px"
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
