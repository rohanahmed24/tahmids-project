import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { ArticleHeader } from "@/components/ArticleHeader";
import { ArticleContent } from "@/components/ArticleContent";
import { ArticleSidebar } from "@/components/ArticleSidebar";
import { BacklinksSection } from "@/components/BacklinksSection";
import { ArticleAudioPlayer } from "@/components/ArticleAudioPlayer";
import { getCurrentLocale } from "@/lib/locale";
import { Assets } from "@/lib/assets";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const locale = await getCurrentLocale();
  const { slug } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.categoryEn, post.slug, 4, locale);

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
        audioUrl={post.audioUrl || undefined}
        videoUrl={post.videoUrl || undefined}
        locale={locale}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Article Content */}
          <div className="space-y-8 min-w-0">
            {post.audioUrl && (
              <ArticleAudioPlayer title={post.title} audioUrl={post.audioUrl} />
            )}

            <ArticleContent>
              {post.content && (
                <div 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                  className="max-w-none break-words [overflow-wrap:anywhere] leading-loose text-text-secondary [&_p]:my-4 [&_p]:break-words [&_li]:break-words [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:break-words [&_h1]:font-serif [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-text-primary [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:break-words [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:text-text-primary [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:break-words [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:text-text-primary [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:break-all [&_a]:text-accent [&_a]:underline [&_code]:break-words [&_code]:rounded [&_code]:bg-bg-tertiary [&_code]:px-1.5 [&_code]:py-0.5 [&_pre]:my-5 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-bg-tertiary [&_pre]:p-4 [&_hr]:my-8 [&_hr]:border-border-subtle"
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
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const locale = await getCurrentLocale();
  const { slug } = await params;
  const post = await getPostBySlug(slug, locale);

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
      images: [post.coverImage || Assets.imgPlaceholderImage],
    },
  };
}
