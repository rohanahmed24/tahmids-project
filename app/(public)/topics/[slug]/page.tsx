import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { StoriesGrid } from "@/components/StoriesGrid";
import { Subscription } from "@/components/Subscription";
import Link from "next/link";
import Image from "next/image";
import { Assets } from "@/lib/assets";
import { getPublicCategorySummaries } from "@/lib/posts";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

interface TopicPageProps {
    params: Promise<{ slug: string }>;
}

const CATEGORY_META_EN: Record<string, { subtitle: string; description: string; accent: string }> = {
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

const CATEGORY_META_BN: Record<string, { subtitle: string; description: string; accent: string }> = {
    technology: {
        subtitle: "উদ্ভাবন ও টুলস",
        description: "প্রযুক্তি প্রবণতা, এআই পরিবর্তন এবং আধুনিক জীবনকে গড়ে তোলা সিস্টেম নিয়ে বিশ্লেষণ।",
        accent: "#60A5FA",
    },
    design: {
        subtitle: "রূপ ও কার্যকারিতা",
        description: "ডিজাইন চিন্তা, নান্দনিকতা এবং অর্থপূর্ণ ডিজিটাল/ভৌত অভিজ্ঞতার কারিগরি দিক।",
        accent: "#A78BFA",
    },
    culture: {
        subtitle: "মানুষ ও সমাজ",
        description: "পরিচয়, মিডিয়া, শিল্প এবং জনআলোচনাকে প্রভাবিত করা সাংস্কৃতিক শক্তি নিয়ে গল্প ও বিশ্লেষণ।",
        accent: "#F472B6",
    },
    business: {
        subtitle: "বাজার ও কৌশল",
        description: "ব্যবসায়িক মডেল, অর্থনৈতিক গতি এবং উচ্চ-প্রভাব সিদ্ধান্তের বাস্তব দৃষ্টিভঙ্গি।",
        accent: "#22C55E",
    },
    self: {
        subtitle: "বিকাশ ও মানসিকতা",
        description: "স্ব-উন্নয়ন, স্বচ্ছতা, অভ্যাস এবং সচেতন জীবন নিয়ে কাঠামো ও গল্প।",
        accent: "#F59E0B",
    },
    politics: {
        subtitle: "ক্ষমতা ও নীতি",
        description: "রাজনৈতিক কাঠামো, নীতির প্রভাব এবং বৈশ্বিক ঘটনাপ্রবাহ নিয়ে প্রেক্ষাপটসমৃদ্ধ কভারেজ।",
        accent: "#EF4444",
    },
};

function getCategoryMeta(slug: string, categoryName: string, locale: "en" | "bn") {
    const fallback = {
        subtitle: locale === "bn" ? "বিষয়ভিত্তিক ফোকাস" : "Category Focus",
        description: locale === "bn"
            ? `${categoryName} থেকে সর্বশেষ লেখা ও বিশ্লেষণ।`
            : `Latest stories and analysis from ${categoryName}.`,
        accent: "#0A2540",
    };

    const metaTable = locale === "bn" ? CATEGORY_META_BN : CATEGORY_META_EN;
    return metaTable[slug] || fallback;
}

function slugToTitle(slug: string): string {
    return slug
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export default async function TopicPage({ params }: TopicPageProps) {
    const locale = await getCurrentLocale();
    const { slug } = await params;
    const categories = await getPublicCategorySummaries(locale);
    const topic = categories.find((category) => category.slug === slug);

    if (!topic) {
        return (
            <main className="min-h-screen bg-base flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif font-bold text-main mb-4">{t(locale, "topicNotFound")}</h1>
                    <p className="text-secondary mb-8">{t(locale, "topicNotFoundBody")}</p>
                    <Link href="/topics" className="text-accent hover:underline">
                        {t(locale, "browseAllTopics")}
                    </Link>
                </div>
            </main>
        );
    }

    const meta = getCategoryMeta(slug, topic.name, locale);
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
                                {t(locale, "latestIn")} {topic.name}
                            </h2>
                            <span className="text-sm font-bold uppercase tracking-widest text-accent">
                                {topic.count} {topic.count === 1 ? t(locale, "story") : t(locale, "stories")}
                            </span>
                        </div>
                    </MotionWrapper>
                    <StoriesGrid category={topic.canonicalName} categoryLabel={topic.name} />
                </div>
            </section>

            {/* Related Topics */}
            <section className="py-20 px-6 bg-surface border-y border-border">
                <div className="max-w-[1280px] mx-auto">
                    <MotionWrapper type="fade-in">
                        <h2 className="text-2xl md:text-3xl font-serif font-medium text-main mb-12 text-center">
                            {t(locale, "exploreRelatedTopics")}
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
    const locale = await getCurrentLocale();
    const { slug } = await params;
    const categoryName = slugToTitle(slug);

    return {
        title: locale === "bn"
            ? `${categoryName} ${t(locale, "stories")} | Wisdomia`
            : `${categoryName} Stories | Wisdomia`,
        description: locale === "bn"
            ? `${categoryName} বিষয়ে ${t(locale, "latestStories")} এবং বিশ্লেষণ দেখুন।`
            : `Explore the latest ${categoryName} stories and analysis on Wisdomia.`,
        alternates: {
            canonical: `/topics/${slug}`,
        },
    };
}
