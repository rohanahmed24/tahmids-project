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
import { getHotTopics, getRecentPosts, getPostsByCategory } from "@/lib/posts";

export default async function Home() {
  const hotTopics = await getHotTopics();
  const recentPosts = await getRecentPosts();

  // Fetch category data
  const politicsPosts = await getPostsByCategory('Politics');
  const mysteryPosts = await getPostsByCategory('Mystery');
  const crimePosts = await getPostsByCategory('Crime');
  const historyPosts = await getPostsByCategory('History');
  const newsPosts = await getPostsByCategory('News');
  const sciencePosts = await getPostsByCategory('Science');

  return (
    <main className="min-h-screen bg-background-light text-text-primary font-sans selection:bg-background-darkest selection:text-white">
      <HeroSlider items={hotTopics} />
      <FeaturedTales articles={recentPosts} />

      {/* Category Sections */}
      <CategorySection title="Politics" slug="politics" articles={politicsPosts} />
      <CategorySection title="Mystery" slug="mystery" articles={mysteryPosts} />
      <CategorySection title="Crime" slug="crime" articles={crimePosts} />
      <CategorySection title="History" slug="history" articles={historyPosts} />
      <CategorySection title="Breaking News" slug="news" articles={newsPosts} />
      <CategorySection title="Science" slug="science" articles={sciencePosts} />

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
