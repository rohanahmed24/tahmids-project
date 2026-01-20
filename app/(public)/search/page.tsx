import { searchPosts } from "@/actions/search";
import { ArticleCard } from "@/components/ArticleCard";
import { Search } from "lucide-react";
import Link from "next/link";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const posts = await searchPosts(q || "");

    return (
        <main className="min-h-screen bg-gray-950 text-white pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <p className="text-purple-400 font-mono text-sm mb-4 uppercase tracking-widest">Search Results</p>
                    <h1 className="text-4xl md:text-6xl font-serif font-black mb-6">
                        {q ? `"${q}"` : "All Stories"}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {posts.length} {posts.length === 1 ? "story" : "stories"} found
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <ArticleCard key={post.slug} article={post} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="max-w-md space-y-2">
                            <h2 className="text-2xl font-bold">No stories found</h2>
                            <p className="text-gray-400">
                                We couldn't find anything matching "{q}". Try searching for different keywords or browse our categories.
                            </p>
                        </div>
                        <Link
                            href="/topics"
                            className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors rounded-full"
                        >
                            Browse Topics
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
