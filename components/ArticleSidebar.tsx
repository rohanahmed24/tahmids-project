import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getAuthorByName } from "@/lib/authors";
import type { Post } from "@/lib/posts";

interface ArticleSidebarProps {
    post: Post;
    relatedPosts: Post[];
}

export async function ArticleSidebar({ post, relatedPosts }: ArticleSidebarProps) {
    const author = getAuthorByName(post.authorName || post.author);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <aside className="space-y-12 shrink-0">
            {/* Author Card - Bento Style */}
            <div className="bg-[#f4f1ea] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white p-8 rounded-none border border-black/5 dark:border-white/5 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden relative">
                        <Image src={author.img} alt={author.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl font-bold leading-none">{author.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">{author.role}</p>
                    </div>
                </div>
                <p className="text-sm opacity-90 leading-relaxed font-sans">
                    {author.bio}
                </p>
                <div className="flex gap-2">
                    <button className="flex-1 py-3 border border-black/10 dark:border-white/10 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                        Follow
                    </button>
                    <button className="px-4 py-3 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Related Stories */}
            <div>
                <h4 className="font-serif text-lg font-bold mb-6 flex items-center gap-2 text-text-primary">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    Related Stories
                </h4>
                {/* Mobile: 2 columns, PC: 1 column (larger cards look better) */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    {relatedPosts.length > 0 ? (
                        relatedPosts.map((post) => (
                            <Link href={`/article/${post.slug}`} key={post.slug} className="group block space-y-3" data-testid={`link-related-post-${post.slug}`}>
                                {/* Mobile: square aspect, PC: 3:2 aspect for larger display */}
                                <div className="relative w-full aspect-square md:aspect-[3/2] overflow-hidden rounded-sm bg-bg-secondary">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 350px"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                                        <span>{post.category}</span>
                                        <span className="mx-1.5">•</span>
                                        <span>{formatDate(post.date)}</span>
                                    </p>
                                    <h5 className="font-serif text-sm md:text-base leading-tight group-hover:underline decoration-1 underline-offset-4 text-text-primary dark:text-gray-200 line-clamp-2">
                                        {post.title}
                                    </h5>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-text-tertiary col-span-2">No related stories yet.</p>
                    )}
                </div>
            </div>
        </aside>
    );
}
