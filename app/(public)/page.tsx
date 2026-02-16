import { HeroSlider } from "@/components/HeroSlider";
import { FeaturedTales } from "@/components/FeaturedTales";
import { getHotTopics, getRecentPosts, getPostsByCategories, getPublicCategorySummaries } from "@/lib/posts";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { getCurrentLocale } from "@/lib/locale";

// Dynamic Imports for Code Splitting (Below the fold components)
const Subscription = dynamic(() => import("@/components/Subscription").then(mod => mod.Subscription));
const ArticleGrid = dynamic(() => import("@/components/ArticleGrid").then(mod => mod.ArticleGrid));
const Testimonials = dynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials));
const FAQ = dynamic(() => import("@/components/FAQ").then(mod => mod.FAQ));
const CTABanner = dynamic(() => import("@/components/CTABanner").then(mod => mod.CTABanner));
const TopicExplore = dynamic(() => import("@/components/TopicExplore").then(mod => mod.TopicExplore));
const AuthorsGrid = dynamic(() => import("@/components/AuthorsGrid").then(mod => mod.AuthorsGrid));
const CategorySection = dynamic(() => import("@/components/CategorySection").then(mod => mod.CategorySection));

// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  return locale === "bn"
    ? {
      title: "Wisdomia - আপনার ডিজিটাল ম্যাগাজিন",
      description: "প্রযুক্তি, নকশা, সংস্কৃতি, ব্যবসা, স্বউন্নয়ন এবং রাজনীতি নিয়ে গুরুত্বপূর্ণ গল্প পড়ুন।",
      keywords: ["digital magazine", "technology", "design", "culture", "business", "self", "politics"],
      openGraph: {
        title: "Wisdomia - আপনার ডিজিটাল ম্যাগাজিন",
        description: "প্রযুক্তি, নকশা, সংস্কৃতি, ব্যবসা, স্বউন্নয়ন এবং রাজনীতি নিয়ে গুরুত্বপূর্ণ গল্প পড়ুন।",
        type: "website",
      },
    }
    : {
      title: "Wisdomia - Your Digital Magazine",
      description: "Explore stories that matter across technology, design, culture, business, self-growth, and politics.",
      keywords: ["digital magazine", "technology", "design", "culture", "business", "self", "politics"],
      openGraph: {
        title: "Wisdomia - Your Digital Magazine",
        description: "Explore stories that matter across technology, design, culture, business, self-growth, and politics.",
        type: "website",
      },
    };
}

export default async function Home() {
  const locale = await getCurrentLocale();

  // Parallel data fetching for better performance
  const [hotTopics, recentPosts, categories] = await Promise.all([
    getHotTopics(5, locale),
    getRecentPosts(10, locale),
    getPublicCategorySummaries(locale),
  ]);
  const homepageCategories = categories.filter(
    (category) => category.slug !== "uncategorized" && category.count > 0
  );
  const categoryData = await getPostsByCategories(
    homepageCategories.map((category) => category.canonicalName),
    6,
    locale
  );

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-bg-secondary selection:text-text-primary">
      <HeroSlider items={hotTopics} />
      <FeaturedTales articles={recentPosts} />

      {/* Category Sections */}
      {homepageCategories.map((category) => (
        <CategorySection
          key={category.slug}
          title={category.name}
          slug={category.slug}
          articles={categoryData[category.canonicalName] || []}
        />
      ))}

      <Subscription />
      <ArticleGrid articles={recentPosts} />
      <TopicExplore categories={categories} locale={locale} />
      <AuthorsGrid />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </main>
  );
}
