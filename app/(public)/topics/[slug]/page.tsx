import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { StoriesGrid } from "@/components/StoriesGrid";
import { Subscription } from "@/components/Subscription";
import Link from "next/link";
import { getPublicCategorySummaries } from "@/lib/posts";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function TopicPage({ params }: TopicPageProps) {
  const locale = await getCurrentLocale();
  const { slug } = await params;
  const categories = await getPublicCategorySummaries(locale);
  const topic = categories.find((category) => category.slug === slug);

  if (!topic) {
    return (
      <main className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-main mb-4">
            {t(locale, "topicNotFound")}
          </h1>
          <p className="text-secondary mb-8">
            {t(locale, "topicNotFoundBody")}
          </p>
          <Link href="/topics" className="text-accent hover:underline">
            {t(locale, "browseAllTopics")}
          </Link>
        </div>
      </main>
    );
  }

  const relatedCategories = categories.filter(
    (category) => category.slug !== slug,
  );

  return (
    <main className="min-h-screen bg-base transition-colors duration-300">
      {/* Stories Grid */}
      <section className="pt-10 pb-20 px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto">
          <MotionWrapper type="fade-in">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-medium text-main">
                {t(locale, "latestIn")} {topic.name}
              </h2>
              <span className="text-sm font-bold uppercase tracking-widest text-accent">
                {topic.count}{" "}
                {topic.count === 1 ? t(locale, "story") : t(locale, "stories")}
              </span>
            </div>
          </MotionWrapper>
          <StoriesGrid
            category={topic.canonicalName}
            categoryLabel={topic.name}
            mobileLayout="grid"
          />
        </div>
      </section>

      {/* Related Topics */}
      <section className="py-20 px-6 bg-surface border-y border-border">
        <div className="max-w-[1280px] mx-auto">
          <MotionWrapper type="fade-in">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-main mb-12 text-center">
              {t(locale, "exploreRelatedTopics")}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {relatedCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/topics/${category.slug}`}
                  className="px-6 py-3 rounded-full border border-border text-main hover:bg-main hover:text-bright transition-all duration-300 font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </section>

      <Subscription />
    </main>
  );
}

export async function generateMetadata({ params }: TopicPageProps) {
  const locale = await getCurrentLocale();
  const { slug } = await params;
  const categoryName = slugToTitle(slug);

  return {
    title:
      locale === "bn"
        ? `${categoryName} ${t(locale, "stories")} | Wisdomia`
        : `${categoryName} Stories | Wisdomia`,
    description:
      locale === "bn"
        ? `${categoryName} বিষয়ে ${t(locale, "latestStories")} এবং বিশ্লেষণ দেখুন।`
        : `Explore the latest ${categoryName} stories and analysis on Wisdomia.`,
    alternates: {
      canonical: `/topics/${slug}`,
    },
  };
}
