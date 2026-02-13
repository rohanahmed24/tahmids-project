import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { StoriesGrid } from "@/components/StoriesGrid";
import { Subscription } from "@/components/Subscription";
import Link from "next/link";
import Image from "next/image";
import { Assets } from "@/lib/assets";
import { getPublicCategorySummaries } from "@/lib/posts";
import { categoryToSlug } from "@/lib/categories";

interface TopicPageProps {
    params: Promise<{ slug: string }>;
}

const CATEGORY_META: Record<string, { subtitle: string; description: string; accent: string }> = {
    technology: {
        subtitle: "Innovation & Tools",
        description: "Deep dives into technology trends, AI shifts, and the systems shaping modern life.",
        accent: "#60A5FA",
    },
    design: {
        subtitle: "Form & Function",
        description: "Exploring design thinking, aesthetics, and the craft behind meaningful digital and physical experiences.",
        accent: "#A78BFA",
    },
    culture: {
        subtitle: "People & Society",
        description: "Stories and analysis on identity, media, art, and the cultural forces driving public discourse.",
        accent: "#F472B6",
    },
    business: {
        subtitle: "Markets & Strategy",
        description: "Practical perspectives on business models, economic movement, and high-impact decision making.",
        accent: "#22C55E",
    },
    self: {
        subtitle: "Growth & Mindset",
        description: "Frameworks and stories around self-improvement, clarity, habits, and intentional living.",
        accent: "#F59E0B",
    },
    politics: {
        subtitle: "Power & Policy",
        description: "Context-rich coverage of political systems, policy outcomes, and global developments.",
        accent: "#EF4444",
    },
};

function getCategoryMeta(slug: string, categoryName: string) {
    const fallback = {
        subtitle: "Category Focus",
        description: `Latest stories and analysis from ${categoryName}.`,
        accent: "#0A2540",
    };

    return CATEGORY_META[slug] || fallback;
}

function slugToTitle(slug: string): string {
    return slug
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export default async function TopicPage({ params }: TopicPageProps) {
    const { slug } = await params;
    const categories = await getPublicCategorySummaries();
    const topic = categories.find((category) => category.slug === slug);

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

    const meta = getCategoryMeta(slug, topic.name);
    const relatedCategories = categories.filter((category) => category.slug !== slug);

    return (
        <main className="min-h-screen bg-base transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={Assets.imgPlaceholderImage7}
                        alt={topic.name}
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
                            style={{ backgroundColor: `${meta.accent}20`, color: meta.accent }}
                        >
                            {meta.subtitle}
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-main tracking-tighter leading-[0.9] mb-6">
                            {topic.name}
                        </h1>
                        <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
                            {meta.description}
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
                                Latest in {topic.name}
                            </h2>
                            <span className="text-sm font-bold uppercase tracking-widest text-accent">
                                {topic.count} {topic.count === 1 ? "Story" : "Stories"}
                            </span>
                        </div>
                    </MotionWrapper>
                    <StoriesGrid category={topic.name} />
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
                            {relatedCategories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/topics/${category.slug}`}
                                    className="px-6 py-3 rounded-full border border-border text-main hover:bg-main hover:text-bright transition-all duration-300 font-medium"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </MotionWrapper>
                </div>
            </section>

            <Subscription />
        </main>
    );
}

export async function generateMetadata({ params }: TopicPageProps) {
    const { slug } = await params;
    const categoryName = slugToTitle(slug);

    return {
        title: `${categoryName} Stories | Wisdomia`,
        description: `Explore the latest ${categoryName} stories and analysis on Wisdomia.`,
        alternates: {
            canonical: `/topics/${categoryToSlug(categoryName)}`,
        },
    };
}
