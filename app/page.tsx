import { HeroSlider } from "@/components/HeroSlider";
import { FeaturedTales } from "@/components/FeaturedTales";
import { Subscription } from "@/components/Subscription";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTABanner } from "@/components/CTABanner";
import { DailyQuote } from "@/components/DailyQuote";
import { TopicExplore } from "@/components/TopicExplore";
import { AuthorsGrid } from "@/components/AuthorsGrid";
import { CategorySection } from "@/components/CategorySection";
import { getHotTopics, getRecentPosts, getPostsByCategories } from "@/lib/posts";

import { Metadata } from "next";

// SEO Metadata
export const metadata: Metadata = {
  title: "Wisdomia - Your Digital Magazine",
  description: "Explore stories that matter across politics, mystery, crime, history, news, and science. Thoughtful, well-researched content that informs and inspires.",
  keywords: ["digital magazine", "politics", "mystery", "crime", "history", "news", "science"],
  openGraph: {
    title: "Wisdomia - Your Digital Magazine",
    description: "Explore stories that matter across politics, mystery, crime, history, news, and science.",
    type: "website",
  },
};

export default async function Home() {
  // Parallel data fetching for better performance
  const [hotTopics, recentPosts, categoryData] = await Promise.all([
    getHotTopics(),
    getRecentPosts(),
    // Single optimized query for all categories
    getPostsByCategories(['Politics', 'Mystery', 'Crime', 'History', 'News', 'Science'])
  ]);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-bg-secondary selection:text-text-primary">
      <HeroSlider items={hotTopics} />
      <FeaturedTales articles={recentPosts} />

      {/* Category Sections */}
      <CategorySection title="Politics" slug="politics" articles={categoryData.Politics} />
      <CategorySection title="Mystery" slug="mystery" articles={categoryData.Mystery} />
      <CategorySection title="Crime" slug="crime" articles={categoryData.Crime} />
      <CategorySection title="History" slug="history" articles={categoryData.History} />
      <CategorySection title="Breaking News" slug="news" articles={categoryData.News} />
      <CategorySection title="Science" slug="science" articles={categoryData.Science} />

      <DailyQuote />
      <Subscription />
      <ArticleGrid articles={recentPosts} />
      <TopicExplore />
      <AuthorsGrid />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </main>
  );
}
