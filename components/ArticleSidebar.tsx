import Link from "next/link";

import type { Post } from "@/lib/posts";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { FallbackImage } from "@/components/ui/FallbackImage";

interface ArticleSidebarProps {
    post: Post;
    relatedPosts: Post[];
    locale?: Locale;
}

export async function ArticleSidebar({ post, relatedPosts, locale = "en" }: ArticleSidebarProps) {
    const displayAuthor = post.authorName?.trim() || post.author || "Anonymous";
    const cleanEditorName = post.editorName?.trim();
    const cleanTranslatorName = post.translatorName?.trim();
    const roleCredits: { key: "translatedBy" | "editedBy"; value: string }[] = [];
    if (cleanTranslatorName) {
        roleCredits.push({ key: "translatedBy", value: cleanTranslatorName });
    }
    if (cleanEditorName) {
        roleCredits.push({ key: "editedBy", value: cleanEditorName });
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { month: 'short', day: 'numeric' });
    };

    return (
        <aside className="space-y-12 shrink-0">
            {/* Author Card - Bento Style */}
            <div className="bg-[#f4f1ea] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white p-8 rounded-none border border-black/5 dark:border-white/5 space-y-6">
                <div>
                    <h3 className="font-serif text-xl font-bold leading-none">{displayAuthor}</h3>
                </div>
                {roleCredits.length > 0 && (
                    <div className="space-y-1 border-y border-black/10 dark:border-white/10 py-3">
                        {roleCredits.map((credit) => (
                            <p key={credit.key} className="text-xs leading-relaxed">
                                <span className="uppercase tracking-widest opacity-60 mr-2">{t(locale, credit.key)}</span>
                                <span className="font-medium">{credit.value}</span>
                            </p>
                        ))}
                    </div>
                )}
            </div>

            {/* Related Stories */}
            <div>
                <h4 className="font-serif text-lg font-bold mb-6 flex items-center gap-2 text-text-primary">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    {t(locale, "relatedStories")}
                </h4>
                {/* Mobile: 2 columns, PC: 1 column (larger cards look better) */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    {relatedPosts.length > 0 ? (
                        relatedPosts.map((post) => (
                            <Link href={`/article/${post.slug}`} key={post.slug} className="group block space-y-3" data-testid={`link-related-post-${post.slug}`}>
                                {/* Mobile: square aspect, PC: 3:2 aspect for larger display */}
                                <div className="relative w-full aspect-square md:aspect-[3/2] overflow-hidden rounded-sm bg-bg-secondary">
                                    <FallbackImage
                                        src={post.coverImage || "/placeholder.jpg"}
                                        alt={post.title}
                                        fallbackSrc="/placeholder.jpg"
                                        fill
                                        sizes="(max-width: 768px) 50vw, 350px"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                                        <span>{post.category}</span>
                                        <span className="mx-1.5">•</span>
                                        <span>{formatDate(post.date)}</span>
                                    </p>
                                    <h5 className="font-serif text-sm md:text-base leading-tight group-hover:underline decoration-1 underline-offset-4 text-text-primary dark:text-gray-200 line-clamp-2">
                                        {post.title?.trim() || post.slug.replace(/-/g, " ")}
                                    </h5>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-text-tertiary col-span-2">{t(locale, "noRelatedStories")}</p>
                    )}
                </div>
            </div>
        </aside>
    );
}
