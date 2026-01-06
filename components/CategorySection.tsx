"use client";

import Image from "next/image";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { MediaOptions } from "@/components/ui/MediaOptions";
import { Article } from "@/lib/mock-data";

interface CategorySectionProps {
    title: string;
    slug: string;
    articles: Article[];
}

export function CategorySection({ title, slug, articles = [] }: CategorySectionProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const cardsPerPage = 2;
    const gap = 12;
    const safeArticles = articles || [];
    const totalPages = Math.ceil(safeArticles.length / cardsPerPage) || 1;

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

    if (safeArticles.length === 0) {
        return null;
    }

    return (
        <section className="w-full py-6 md:py-16 bg-bg-primary">
            <div className="max-w-[1800px] mx-auto px-4 md:px-12">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-4 md:mb-10">
                    <h2
                        className="font-serif font-medium tracking-tight text-text-primary"
                        style={{ fontSize: 'clamp(1.125rem, 3vw, 2.25rem)' }}
                    >
                        {title}
                    </h2>
                    <Link
                        href={`/topics/${slug}`}
                        className="font-bold uppercase tracking-widest text-accent hover:underline"
                        style={{ fontSize: 'clamp(0.625rem, 1vw, 0.875rem)' }}
                    >
                        View All
                    </Link>
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
                            {safeArticles.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/article/${item.slug}`}
                                    className="flex-shrink-0"
                                    style={{ width: cardWidth }}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-2">
                                        <Image
                                            src={item.img}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            alt={item.title}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    </div>
                                    <h3 className="text-xs font-serif leading-tight text-text-primary line-clamp-2 mb-1">
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
                    {totalPages > 1 && (
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
                    )}
                </div>

                {/* Desktop: 4 per row grid */}
                <div className="hidden md:grid grid-cols-4 gap-6">
                    {safeArticles.slice(0, 4).map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="group cursor-pointer"
                        >
                            <Link href={`/article/${item.slug}`}>
                                <div className="relative aspect-[3/4] overflow-hidden mb-4 transition-all duration-700">
                                    <Image
                                        src={item.img}
                                        fill
                                        sizes="(max-width: 1200px) 25vw, 300px"
                                        alt={item.title}
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                </div>

                                <div className="space-y-2">
                                    <div
                                        className="flex items-center gap-2 uppercase font-bold tracking-widest"
                                        style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.625rem)' }}
                                    >
                                        <span className="text-accent">{title}</span>
                                        <span className="text-text-muted">•</span>
                                        <span className="text-text-muted">{item.date}</span>
                                    </div>
                                    <h3
                                        className="font-serif leading-tight group-hover:underline decoration-1 underline-offset-4 text-text-primary line-clamp-2"
                                        style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)' }}
                                    >
                                        {item.title}
                                    </h3>
                                    <MediaOptions slug={item.slug} variant="compact" className="mt-2" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
