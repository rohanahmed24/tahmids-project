import { searchPosts } from "@/actions/search";
import { ArticleCard } from "@/components/ArticleCard";
import { Search } from "lucide-react";
import Link from "next/link";
import { getCurrentLocale } from "@/lib/locale";

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const searchTerm = q || "";
    const posts = await searchPosts(searchTerm);
    const locale = await getCurrentLocale();
    const copy = locale === "bn"
        ? {
            results: "সার্চ ফলাফল",
            allStories: "সব লেখা",
            story: "লেখা",
            stories: "লেখা",
            found: "পাওয়া গেছে",
            noStories: "কোনো লেখা পাওয়া যায়নি",
            noStoriesBody: `“${searchTerm}” এর সাথে মেলে এমন কিছু পাওয়া যায়নি। ভিন্ন কীওয়ার্ড দিয়ে চেষ্টা করুন বা বিষয়ভিত্তিক পেজ দেখুন।`,
            browseTopics: "বিষয়গুলো দেখুন",
        }
        : {
            results: "Search Results",
            allStories: "All Stories",
            story: "story",
            stories: "stories",
            found: "found",
            noStories: "No stories found",
            noStoriesBody: `We couldn't find anything matching "${searchTerm}". Try searching for different keywords or browse our categories.`,
            browseTopics: "Browse Topics",
        };

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <p className="text-accent font-mono text-sm mb-4 uppercase tracking-widest">{copy.results}</p>
                    <h1 className="text-4xl md:text-6xl font-serif font-black mb-6">
                        {searchTerm ? `"${searchTerm}"` : copy.allStories}
                    </h1>
                    <p className="text-text-muted text-lg">
                        {posts.length} {posts.length === 1 ? copy.story : copy.stories} {copy.found}
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
                        <div className="w-20 h-20 bg-bg-secondary border border-border-subtle rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-text-muted" />
                        </div>
                        <div className="max-w-md space-y-2">
                            <h2 className="text-2xl font-bold text-text-primary">{copy.noStories}</h2>
                            <p className="text-text-muted">
                                {copy.noStoriesBody}
                            </p>
                        </div>
                        <Link
                            href="/topics"
                            className="px-8 py-3 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity rounded-full"
                        >
                            {copy.browseTopics}
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
