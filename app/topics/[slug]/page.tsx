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
    "design-culture": {
        title: "Design Culture",
        subtitle: "Form Meets Function",
        description: "A deep dive into the world of design thinking, visual aesthetics, and the cultural movements that shape how we create and experience beauty in everyday life.",
        accent: "#F472B6",
        heroImage: Assets.imgPlaceholderImage5,
    },
    "minimalism": {
        title: "Minimalism",
        subtitle: "Less is More",
        description: "The art of intentional living. Discover how stripping away the unnecessary reveals what truly matters—in design, lifestyle, and thought.",
        accent: "#A78BFA",
        heroImage: Assets.imgPlaceholderImage4,
    },
    "future-tech": {
        title: "Future Tech",
        subtitle: "Tomorrow's World Today",
        description: "Emerging technologies, speculative futures, and the innovations that will define the next decade. From quantum computing to space exploration.",
        accent: "#34D399",
        heroImage: Assets.imgPlaceholderImage6,
    },
    "psychology": {
        title: "Psychology",
        subtitle: "The Mind Explored",
        description: "Understanding human behavior, cognitive patterns, and the science of the mind. Insights that help us understand ourselves and others better.",
        accent: "#FBBF24",
        heroImage: Assets.imgPlaceholderImage2,
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
                    <StoriesGrid />
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
