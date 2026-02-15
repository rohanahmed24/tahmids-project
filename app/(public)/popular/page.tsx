import { ArticleCard } from "@/components/ArticleCard";
import { getFeaturedPosts } from "@/lib/posts";
import { TrendingUp } from "lucide-react";
import { Metadata } from "next";
import { getCurrentLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getCurrentLocale();
    return locale === "bn"
        ? {
            title: "জনপ্রিয় লেখা - Wisdomia",
            description: "Wisdomia-র সবচেয়ে জনপ্রিয় এবং ট্রেন্ডিং লেখাগুলো দেখুন।",
        }
        : {
            title: "Popular Stories - Wisdomia",
            description: "Discover the most popular and trending stories on Wisdomia.",
        };
}

export default async function PopularPage() {
    const locale = await getCurrentLocale();
    const posts = await getFeaturedPosts(12, locale);
    const copy = locale === "bn"
        ? {
            trending: "এখন ট্রেন্ডিং",
            title: "জনপ্রিয় লেখা",
            subtitle: "আমাদের কমিউনিটির সবচেয়ে বেশি পড়া ও আলোচিত লেখাগুলো।",
            empty: "এখনও জনপ্রিয় কোনো লেখা নেই। পরে আবার দেখুন!",
        }
        : {
            trending: "Trending Now",
            title: "Popular Stories",
            subtitle: "The most-read and trending articles from our community. Stories that sparked conversations and inspired readers.",
            empty: "No popular stories yet. Check back soon!",
        };

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-accent mb-4">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-mono text-sm uppercase tracking-widest">{copy.trending}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black mb-6">
                        {copy.title}
                    </h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        {copy.subtitle}
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <ArticleCard key={post.slug} article={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-text-secondary text-lg">
                            {copy.empty}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
