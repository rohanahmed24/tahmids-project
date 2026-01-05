import { ArticleHeader } from "@/components/ArticleHeader";
import { ArticleContent } from "@/components/ArticleContent";
import { ArticleSidebar } from "@/components/ArticleSidebar";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { DailyQuote } from "@/components/DailyQuote";
import { Subscription } from "@/components/Subscription";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { ArticleAudioPlayer } from "@/components/ArticleAudioPlayer";
import { ArticleVideoPlayer } from "@/components/ArticleVideoPlayer";

export async function generateStaticParams() {
    const posts = getAllPosts();
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
    const { mode } = await searchParams;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const isWatchMode = mode === 'watch';

    return (
        <main className="min-h-screen bg-bg-primary selection:bg-bg-inverse selection:text-text-inverse">
            <article className="pb-20">
                <MotionWrapper type="fade-in" delay={0.1}>
                    <ArticleHeader
                        title={post.title}
                        author={post.author}
                        date={post.date}
                        category={post.category}
                        coverImage={post.coverImage}
                        slug={post.slug}
                    />
                </MotionWrapper>

                <div className="max-w-[1440px] mx-auto px-6 md:px-16 2xl:px-32 mt-12 md:mt-20 flex flex-col lg:flex-row gap-12 2xl:gap-24 relative">
                    <div className="flex-1 min-w-0"> {/* Main Content */}
                        {/* Video Player (Watch Mode) */}
                        {isWatchMode && post.videoUrl && (
                            <div className="mb-8">
                                <ArticleVideoPlayer videoUrl={post.videoUrl} title={post.title} />
                            </div>
                        )}

                        {/* Audio Player (Default/Listen Mode) */}
                        {!isWatchMode && (
                            <div className="mb-8">
                                <ArticleAudioPlayer title={post.title} content={post.content} />
                            </div>
                        )}

                        <ArticleContent>
                            <MDXRemote source={post.content} />
                        </ArticleContent>
                    </div>

                    <aside className="w-full lg:w-[350px] 2xl:w-[400px] flex-shrink-0">
                        <div className="sticky top-32">
                            <ArticleSidebar />
                        </div>
                    </aside>
                </div>
            </article>

            <DailyQuote />
            <Subscription />
        </main>
    );
}

