import { HeroSlider } from "@/components/HeroSlider";
import { FeaturedTales } from "@/components/FeaturedTales";
import { getHotTopics, getRecentPosts, getPostsByCategories, getPublicCategorySummaries } from "@/lib/posts";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { BASE_CATEGORIES, categoryToSlug } from "@/lib/categories";

// Dynamic Imports for Code Splitting (Below the fold components)
const Subscription = dynamic(() => import("@/components/Subscription").then(mod => mod.Subscription));
const ArticleGrid = dynamic(() => import("@/components/ArticleGrid").then(mod => mod.ArticleGrid));
const Testimonials = dynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials));
const FAQ = dynamic(() => import("@/components/FAQ").then(mod => mod.FAQ));
const CTABanner = dynamic(() => import("@/components/CTABanner").then(mod => mod.CTABanner));
const DailyQuote = dynamic(() => import("@/components/DailyQuote").then(mod => mod.DailyQuote));
const TopicExplore = dynamic(() => import("@/components/TopicExplore").then(mod => mod.TopicExplore));
const AuthorsGrid = dynamic(() => import("@/components/AuthorsGrid").then(mod => mod.AuthorsGrid));
const CategorySection = dynamic(() => import("@/components/CategorySection").then(mod => mod.CategorySection));

// SEO Metadata
export const metadata: Metadata = {
  title: "Wisdomia - Your Digital Magazine",
  description: "Explore stories that matter across technology, design, culture, business, self-growth, and politics.",
  keywords: ["digital magazine", "technology", "design", "culture", "business", "self", "politics"],
  openGraph: {
    title: "Wisdomia - Your Digital Magazine",
    description: "Explore stories that matter across technology, design, culture, business, self-growth, and politics.",
    type: "website",
  },
};

export default async function Home() {
  const homepageCategories = BASE_CATEGORIES.map((category) => ({
    title: category,
    slug: categoryToSlug(category),
  }));

  // Parallel data fetching for better performance
  const [hotTopics, recentPosts, categoryData, categories] = await Promise.all([
    getHotTopics(),
    getRecentPosts(),
    // Single optimized query for all categories
    getPostsByCategories(homepageCategories.map((category) => category.title)),
    getPublicCategorySummaries(),
  ]);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-bg-secondary selection:text-text-primary">
      <HeroSlider items={hotTopics} />
      <FeaturedTales articles={recentPosts} />

      {/* Category Sections */}
      {homepageCategories.map((category) => (
        <CategorySection
          key={category.slug}
          title={category.title}
          slug={category.slug}
          articles={categoryData[category.title] || []}
        />
      ))}

      <DailyQuote />
      <Subscription />
      <ArticleGrid articles={recentPosts} />
      <TopicExplore categories={categories} />
      <AuthorsGrid />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </main>
  );
}
