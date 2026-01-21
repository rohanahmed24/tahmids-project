import { ArticleHeader } from "@/components/ArticleHeader";
import { ArticleContent } from "@/components/ArticleContent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ArticleSidebar } from "@/components/ArticleSidebar";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { DailyQuote } from "@/components/DailyQuote";
import { Subscription } from "@/components/Subscription";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import { ArticleAudioPlayer } from "@/components/ArticleAudioPlayer";
import { ArticleVideoPlayer } from "@/components/ArticleVideoPlayer";
import { CustomAudioPlayer } from "@/components/ui/CustomAudioPlayer";

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function ArticlePage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const mode = resolvedSearchParams?.mode;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const isWatchMode = mode === 'watch';

    // Imports needed (adding to top of file in next step if not possible here, but let's try to replace the component usage)
    // To do this properly I need to add imports to the file first.
    // I will just return the content block here and add imports in a separate call or use multi_replace.
    // Let's use multi_replace.
    // Aborting this specific tool call to use multi_replace for clean import + usage update.
    return (
        <main className="min-h-screen bg-bg-primary selection:bg-bg-inverse selection:text-text-inverse">
            <article className="pb-20">
                <MotionWrapper type="fade-in" delay={0.1}>
                    <ArticleHeader
                        title={post.title}
                        author={post.author}
                        date={post.date}
                        category={post.category}
                        coverImage={post.coverImage || undefined}
                        slug={post.slug}
                    />
                </MotionWrapper>

                <div id="article-content" className="max-w-[1440px] mx-auto px-6 md:px-16 2xl:px-32 mt-12 md:mt-20 flex flex-col lg:flex-row gap-12 2xl:gap-24 relative">
                    <div className="flex-1 min-w-0"> {/* Main Content */}
                        {/* Video Player (Watch Mode) - or Generator if missing */}
                        {isWatchMode && (
                            <div className="mb-8">
                                {post.videoUrl ? (
                                    <ArticleVideoPlayer videoUrl={post.videoUrl} title={post.title} />
                                ) : (
                                    <div className="aspect-video flex flex-col items-center justify-center bg-bg-secondary rounded-xl border border-border-subtle gap-4 p-8 text-center">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold text-text-primary">No video available</h3>
                                            <p className="text-sm text-text-tertiary">Video content is not available for this article yet.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Audio Player (Default/Listen Mode) */}
                        {!isWatchMode && (
                            <div className="mb-8 space-y-4">
                                {/* Use uploaded audio if available, otherwise fall back to text-to-speech */}
                                {post.audioUrl ? (
                                    <CustomAudioPlayer src={post.audioUrl} title={`Listen to: ${post.title}`} />
                                ) : (
                                    <ArticleAudioPlayer title={post.title} content={post.content || ""} />
                                )}
                                {!post.videoUrl && (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-bg-secondary rounded-xl border border-border-subtle">
                                        <div className="text-sm text-text-secondary">
                                            <span className="font-medium text-text-primary">Note:</span> Video explanation coming soon.
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <ArticleContent>
                            <div className="prose prose-lg max-w-none text-text-main leading-relaxed prose-headings:font-serif prose-a:text-accent-main prose-img:rounded-xl">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        iframe: ({ node, ...props }) => (
                                            <iframe
                                                {...props}
                                                className="w-full aspect-video rounded-xl my-6"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        ),
                                        audio: ({ node, ...props }) => (
                                            <CustomAudioPlayer
                                                src={props.src as string}
                                                title="Audio Clip"
                                            />
                                        ),
                                    }}
                                >
                                    {post.content || ""}
                                </ReactMarkdown>
                            </div>
                        </ArticleContent>
                    </div>

                    <aside className="w-full lg:w-[350px] 2xl:w-[400px] flex-shrink-0">
                        <div className="sticky top-32">
                            <ArticleSidebar authorName={post.author} category={post.category} currentSlug={post.slug} />
                        </div>
                    </aside>
                </div>
            </article>

            <DailyQuote />
            <Subscription />
        </main>
    );
}

