"use client";

import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { StoriesGrid } from "@/components/StoriesGrid";
import { Subscription } from "@/components/Subscription";
import Link from "next/link";
import Image from "next/image";
import { Assets } from "@/lib/assets";
import { useParams } from "next/navigation";

// Topic data with metadata
const topicsData: Record<string, {
    title: string;
    subtitle: string;
    description: string;
    accent: string;
    heroImage: string;
}> = {
    "technology-ai": {
        title: "Technology & AI",
        subtitle: "The Digital Frontier",
        description: "Exploring the intersection of human creativity and machine intelligence. From breakthrough algorithms to ethical considerations, we examine how technology is reshaping our world.",
        accent: "#60A5FA",
        heroImage: Assets.imgPlaceholderImage7,
    },
    // ... existing ... 
    "politics": {
        title: "Politics",
        subtitle: "Global Perspectives",
        description: "In-depth analysis of political shifts, policy changes, and international relations defining our era.",
        accent: "#EF4444",
        heroImage: "/imgs/Arab Spring.png",
    },
    "mystery": {
        title: "Mystery",
        subtitle: "The Unknown",
        description: "Unraveling the world's most perplexing enigmas, from vanishings to unexplained phenomena.",
        accent: "#8B5CF6",
        heroImage: "/imgs/Stonehenge.jpeg",
    },
    "crime": {
        title: "Crime",
        subtitle: "True Stories",
        description: "Examination of cold cases, forensic breakthroughs, and the pursuit of justice.",
        accent: "#DC2626",
        heroImage: "/imgs/Jack the Ripper.jpeg",
    },
    "history": {
        title: "History",
        subtitle: "Past & Present",
        description: "Connecting the dots between historical events and modern realities.",
        accent: "#D97706",
        heroImage: "/imgs/Great Wall of China.jpeg",
    },
    "news": {
        title: "Breaking News",
        subtitle: "Up to the Minute",
        description: "Essential updates on the events shaping our world right now.",
        accent: "#2563EB",
        heroImage: "/imgs/Petrodollar.png",
    },
    "science": {
        title: "Science",
        subtitle: "Discovery & Innovation",
        description: "From the cosmos to the microscopic, exploring the frontiers of scientific discovery.",
        accent: "#10B981",
        heroImage: "/imgs/Genetic Memory.png",
    },
};

export default function TopicPage() {
    const params = useParams();
    const slug = params.slug as string;
    const topic = topicsData[slug];

    if (!topic) {
        return (
            <main className="min-h-screen bg-base flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif font-bold text-main mb-4">Topic Not Found</h1>
                    <p className="text-secondary mb-8">The topic you're looking for doesn't exist.</p>
                    <Link href="/topics" className="text-accent hover:underline">
                        Browse All Topics
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-base transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={topic.heroImage}
                        alt={topic.title}
                        fill
                        sizes="100vw"
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-base/50 via-base/80 to-base" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <MotionWrapper type="slide-up">
                        <span
                            className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-6 px-4 py-2 rounded-full"
                            style={{ backgroundColor: `${topic.accent}20`, color: topic.accent }}
                        >
                            {topic.subtitle}
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-main tracking-tighter leading-[0.9] mb-6">
                            {topic.title}
                        </h1>
                        <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
                            {topic.description}
                        </p>
                    </MotionWrapper>
                </div>
            </section>

            {/* Stories Grid */}
            <section className="py-20 px-6 md:px-12">
                <div className="max-w-[1280px] mx-auto">
                    <MotionWrapper type="fade-in">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl md:text-3xl font-serif font-medium text-main">
                                Latest in {topic.title}
                            </h2>
                            <Link
                                href={`/stories?topic=${encodeURIComponent(topic.title)}`}
                                className="text-sm font-bold uppercase tracking-widest text-accent hover:underline"
                            >
                                View All →
                            </Link>
                        </div>
                    </MotionWrapper>
                    <StoriesGrid category={topic.title} />
                </div>
            </section>

            {/* Related Topics */}
            <section className="py-20 px-6 bg-surface border-y border-border">
                <div className="max-w-[1280px] mx-auto">
                    <MotionWrapper type="fade-in">
                        <h2 className="text-2xl md:text-3xl font-serif font-medium text-main mb-12 text-center">
                            Explore Related Topics
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {Object.entries(topicsData)
                                .filter(([key]) => key !== slug)
                                .map(([key, data]) => (
                                    <Link
                                        key={key}
                                        href={`/topics/${key}`}
                                        className="px-6 py-3 rounded-full border border-border text-main hover:bg-main hover:text-bright transition-all duration-300 font-medium"
                                    >
                                        {data.title}
                                    </Link>
                                ))}
                        </div>
                    </MotionWrapper>
                </div>
            </section>

            {/* Subscription */}
            <Subscription />
        </main>
    );
}
