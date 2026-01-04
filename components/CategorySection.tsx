"use client";

import Image from "next/image";
import { Assets } from "@/lib/assets";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { MediaOptions } from "@/components/ui/MediaOptions";
import { StaticImageData } from "next/image";

interface Article {
    id: string;
    title: string;
    img: StaticImageData;
    slug: string;
    author: string;
    date: string;
}

interface CategorySectionProps {
    title: string;
    slug: string;
    articles: Article[];
}

export function CategorySection({ title, slug, articles }: CategorySectionProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const cardsPerPage = 2;
    const gap = 12;
    const totalPages = Math.ceil(articles.length / cardsPerPage);

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

    return (
        <section className="w-full py-6 md:py-16 bg-bg-primary">
            <div className="max-w-[1800px] mx-auto px-4 md:px-12">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-4 md:mb-10">
                    <h2 className="text-lg md:text-4xl font-serif font-medium tracking-tight text-text-primary">
                        {title}
                    </h2>
                    <Link
                        href={`/topics/${slug}`}
                        className="text-xs md:text-sm font-bold uppercase tracking-widest text-accent hover:underline"
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
                            {articles.map((item) => (
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
                    {articles.slice(0, 4).map((item) => (
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
                                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                                        <span className="text-accent">{title}</span>
                                        <span className="text-text-muted">•</span>
                                        <span className="text-text-muted">{item.date}</span>
                                    </div>
                                    <h3 className="text-lg font-serif leading-tight group-hover:underline decoration-1 underline-offset-4 text-text-primary line-clamp-2">{item.title}</h3>
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

// Pre-defined category data
export const categoryData = {
    politics: {
        title: "Politics",
        slug: "politics",
        articles: [
            { id: "p1", title: "The Changing Landscape of Global Democracy", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "John Smith", date: "Dec 20" },
            { id: "p2", title: "Election Reforms: What's Next for Voting Rights", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "Sarah Lee", date: "Dec 18" },
            { id: "p3", title: "International Relations in the Modern Era", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Mike Chen", date: "Dec 15" },
            { id: "p4", title: "The Rise of Political Activism Online", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Emma Wilson", date: "Dec 12" },
            { id: "p5", title: "Climate Policy and Political Will", img: Assets.imgStoryCulture, slug: "science-sleep", author: "David Miller", date: "Dec 10" },
            { id: "p6", title: "Understanding Political Polarization", img: Assets.imgStoryScience, slug: "mindful-living", author: "Lisa Park", date: "Dec 8" },
        ]
    },
    mystery: {
        title: "Mystery",
        slug: "mystery",
        articles: [
            { id: "m1", title: "The Bermuda Triangle: Science vs Legend", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "James Wright", date: "Dec 22" },
            { id: "m2", title: "Unsolved: The Zodiac Killer's Final Cipher", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Rachel Green", date: "Dec 19" },
            { id: "m3", title: "Ancient Mysteries of the Pyramids", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Tom Baker", date: "Dec 16" },
            { id: "m4", title: "The Lost City of Atlantis: Myth or Reality?", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Nina Patel", date: "Dec 13" },
            { id: "m5", title: "Mysterious Disappearances That Baffled Experts", img: Assets.imgStoryArt, slug: "future-cities", author: "Alex Kim", date: "Dec 11" },
            { id: "m6", title: "The Oak Island Money Pit Mystery", img: Assets.imgStoryHistory, slug: "creative-process", author: "Chris Evans", date: "Dec 9" },
        ]
    },
    crime: {
        title: "Crime",
        slug: "crime",
        articles: [
            { id: "c1", title: "Inside the Mind of Criminal Profilers", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Dr. Sarah Chen", date: "Dec 21" },
            { id: "c2", title: "The Evolution of Forensic Science", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Mark Johnson", date: "Dec 18" },
            { id: "c3", title: "Cybercrime: The New Frontier of Law Enforcement", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Tech Weekly", date: "Dec 15" },
            { id: "c4", title: "Cold Cases Solved by Modern DNA Technology", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "Jane Foster", date: "Dec 12" },
            { id: "c5", title: "The Psychology Behind White Collar Crime", img: Assets.imgStoryCulture, slug: "science-sleep", author: "Prof. Williams", date: "Dec 10" },
            { id: "c6", title: "True Crime Podcasts: Entertainment or Education?", img: Assets.imgStoryScience, slug: "mindful-living", author: "Media Watch", date: "Dec 8" },
        ]
    },
    history: {
        title: "History",
        slug: "history",
        articles: [
            { id: "h1", title: "The Rise and Fall of Ancient Empires", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Prof. Anderson", date: "Dec 23" },
            { id: "h2", title: "World War II: Stories Never Told", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Military History", date: "Dec 20" },
            { id: "h3", title: "The Renaissance: Art, Science, and Revolution", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "Art Institute", date: "Dec 17" },
            { id: "h4", title: "Industrial Revolution: How It Changed Everything", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Economic Times", date: "Dec 14" },
            { id: "h5", title: "Ancient Civilizations and Their Legacies", img: Assets.imgStoryArt, slug: "future-cities", author: "Archaeology Today", date: "Dec 11" },
            { id: "h6", title: "The Space Race: A Cold War Story", img: Assets.imgStoryHistory, slug: "creative-process", author: "NASA Archives", date: "Dec 9" },
        ]
    },
    news: {
        title: "Breaking News",
        slug: "news",
        articles: [
            { id: "n1", title: "Global Markets React to Economic Shifts", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Finance Desk", date: "Today" },
            { id: "n2", title: "Climate Summit: World Leaders Make New Pledges", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "Environment", date: "Today" },
            { id: "n3", title: "Tech Giants Face New Regulatory Challenges", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Tech News", date: "Yesterday" },
            { id: "n4", title: "Healthcare Innovation: Breakthrough Treatments", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Health Desk", date: "Yesterday" },
            { id: "n5", title: "Sports: Championship Finals Draw Record Viewers", img: Assets.imgStoryCulture, slug: "science-sleep", author: "Sports Desk", date: "2 days ago" },
            { id: "n6", title: "Entertainment: Award Season Predictions", img: Assets.imgStoryScience, slug: "mindful-living", author: "Entertainment", date: "2 days ago" },
        ]
    },
    science: {
        title: "Science",
        slug: "science",
        articles: [
            { id: "s1", title: "James Webb Telescope: New Discoveries Unveiled", img: Assets.imgStoryScience, slug: "science-sleep", author: "NASA", date: "Dec 22" },
            { id: "s2", title: "The Future of Quantum Computing", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Tech Labs", date: "Dec 19" },
            { id: "s3", title: "Climate Science: Understanding the Data", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "IPCC", date: "Dec 16" },
            { id: "s4", title: "Neuroscience: Mapping the Human Brain", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Brain Institute", date: "Dec 13" },
            { id: "s5", title: "Gene Editing: CRISPR's Next Frontier", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Bio Weekly", date: "Dec 10" },
            { id: "s6", title: "Renewable Energy Breakthroughs", img: Assets.imgStoryCulture, slug: "mindful-living", author: "Green Tech", date: "Dec 8" },
        ]
    },
};
