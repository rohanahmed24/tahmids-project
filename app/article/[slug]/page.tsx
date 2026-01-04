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

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

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
                        {/* Audio Player */}
                        <div className="mb-8">
                            <ArticleAudioPlayer title={post.title} content={post.content} />
                        </div>

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

