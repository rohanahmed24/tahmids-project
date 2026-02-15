import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { ArticleHeader } from "@/components/ArticleHeader";
import { ArticleContent } from "@/components/ArticleContent";
import { ArticleSidebar } from "@/components/ArticleSidebar";
import { BacklinksSection } from "@/components/BacklinksSection";
import { ArticleAudioPlayer } from "@/components/ArticleAudioPlayer";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug, 4);

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-clip">
      {/* Article Header */}
      <ArticleHeader
        title={post.title}
        author={post.author}
        translatorName={post.translatorName}
        editorName={post.editorName}
        date={post.date}
        category={post.category}
        subtitle={post.subtitle || undefined}
        coverImage={post.coverImage || undefined}
        slug={post.slug}
        videoUrl={post.videoUrl || undefined}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Article Content */}
          <div className="space-y-8 min-w-0">
            {post.content && (
              <ArticleAudioPlayer title={post.title} content={post.content} />
            )}

            <ArticleContent>
              {post.content && (
                <div 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                  className="prose prose-lg md:prose-xl dark:prose-invert max-w-none break-words [overflow-wrap:anywhere] [&_p]:break-words [&_li]:break-words [&_h1]:break-words [&_h2]:break-words [&_h3]:break-words [&_a]:break-all [&_code]:break-words [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
                />
              )}
            </ArticleContent>

            {/* Backlinks Section */}
            {post.backlinks && post.backlinks.length > 0 && (
              <BacklinksSection backlinks={post.backlinks} />
            )}
          </div>

          {/* Sidebar */}
          <ArticleSidebar 
            post={post} 
            relatedPosts={relatedPosts} 
          />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt || "Read this article on Wisdomia",
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt || "Read this article on Wisdomia",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}
