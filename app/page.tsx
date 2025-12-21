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

export default function Home() {
  return (
    <main className="min-h-screen bg-background-light text-text-primary font-sans selection:bg-background-darkest selection:text-white">
      <HeroSlider />
      <FeaturedTales />
      <DailyQuote />
      <Subscription />
      <ArticleGrid />
      <TopicExplore />
      <AuthorsGrid />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </main>
  );
}
