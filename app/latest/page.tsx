import { ArticleCard } from "@/components/ArticleCard";
import { getRecentPosts } from "@/lib/posts";
import { Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Latest Stories - Wisdomia",
    description: "Read the newest and freshest content on Wisdomia.",
};

export default async function LatestPage() {
    const posts = await getRecentPosts(12);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-accent mb-4">
                        <Clock className="w-5 h-5" />
                        <span className="font-mono text-sm uppercase tracking-widest">Fresh Content</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black mb-6">
                        Latest Stories
                    </h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Stay up to date with the most recent articles and insights from our writers.
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
                            No stories published yet. Check back soon!
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
