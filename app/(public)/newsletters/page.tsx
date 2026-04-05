"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ArticleNewsletterSignup } from "@/components/ArticleNewsletterSignup";

export default function NewslettersPage() {
  const { locale } = useLocale();
  const copy =
    locale === "bn"
      ? {
          newsletters: "নিউজলেটার",
          stayInformed: "আপডেট থাকুন",
          subtitle:
            "আমাদের নিউজলেটার সাবস্ক্রাইব করুন, কোনো গুরুত্বপূর্ণ গল্প মিস করবেন না।",
          backHome: "← হোমে ফিরুন",
        }
      : {
          newsletters: "Newsletters",
          stayInformed: "Stay Informed",
          subtitle:
            "Subscribe to our newsletters and never miss a story. Get curated content delivered directly to your inbox.",
          backHome: "← Back to Home",
        };

  const newsletters =
    locale === "bn"
      ? [
          {
            title: "সাপ্তাহিক প্রজ্ঞা",
            description:
              "সপ্তাহের সেরা কিউরেটেড লেখাগুলো, প্রতি রবিবার আপনার ইনবক্সে।",
            frequency: "সাপ্তাহিক",
          },
          {
            title: "ব্রেকিং ইনসাইটস",
            description: "গুরুত্বপূর্ণ বড় খবর ও গল্প, ঘটনার সাথে সাথেই।",
            frequency: "প্রয়োজনে",
          },
          {
            title: "ডিপ ডাইভস",
            description:
              "গুরুত্বপূর্ণ বিষয় নিয়ে গভীর বিশ্লেষণ ও দীর্ঘ-আকারের লেখা।",
            frequency: "মাসিক",
          },
        ]
      : [
          {
            title: "Weekly Wisdom",
            description:
              "A curated selection of the week's best stories, delivered every Sunday.",
            frequency: "Weekly",
          },
          {
            title: "Breaking Insights",
            description:
              "Major stories and breaking news that matter, as they happen.",
            frequency: "As needed",
          },
          {
            title: "Deep Dives",
            description:
              "In-depth analysis and long-form journalism on important topics.",
            frequency: "Monthly",
          },
        ];

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary pt-10 pb-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-accent mb-4">
            <Newspaper className="w-5 h-5" />
            <span className="font-mono text-sm uppercase tracking-widest">
              {copy.newsletters}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black mb-6">
            {copy.stayInformed}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>

        <div className="grid gap-6 mb-16">
          {newsletters.map((newsletter, index) => (
            <motion.div
              key={newsletter.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`card-newsletter-${index}`}
              className="bg-bg-secondary border border-border-primary rounded-2xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3
                    data-testid={`text-newsletter-title-${index}`}
                    className="text-xl font-bold text-text-primary mb-2"
                  >
                    {newsletter.title}
                  </h3>
                  <p
                    data-testid={`text-newsletter-description-${index}`}
                    className="text-text-secondary"
                  >
                    {newsletter.description}
                  </p>
                  <span
                    data-testid={`text-newsletter-frequency-${index}`}
                    className="inline-block mt-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full"
                  >
                    {newsletter.frequency}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full">
          <ArticleNewsletterSignup locale={locale} variant="footer" />
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            data-testid="link-back-home"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            {copy.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
