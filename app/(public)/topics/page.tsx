import { TopicExplore } from "@/components/TopicExplore";
import { Subscription } from "@/components/Subscription";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import Link from "next/link";
import Image from "next/image";
import { Assets } from "@/lib/assets";
import { getPublicCategorySummaries } from "@/lib/posts";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

export default async function TopicsPage() {
    const locale = await getCurrentLocale();
    const categories = await getPublicCategorySummaries(locale);
    const featured = locale === "bn"
        ? {
            titleTop: "ডিজিটাল চেতনার",
            titleBottom: "ভবিষ্যৎ",
            body: "ছয় পর্বের একটি সিরিজ, যেখানে কৃত্রিম বুদ্ধিমত্তা কীভাবে সৃজনশীলতা, নৈতিকতা ও মানবিক সংযোগ সম্পর্কে আমাদের ধারণা বদলাচ্ছে তা অনুসন্ধান করা হয়েছে।",
        }
        : {
            titleTop: "The Future of",
            titleBottom: "Digital Consciousness",
            body: "A six-part series exploring how artificial intelligence is reshaping our understanding of creativity, ethics, and human connection.",
        };

    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-300">
            {/* 1. Hero Section */}
            <section className="pt-28 pb-20 px-6 text-center bg-bg-primary">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-text-primary mb-6 block">{t(locale, "discovery")}</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-medium text-text-primary tracking-tighter leading-[0.9]">
                        {t(locale, "exploreDepths")} <br />
                        <span className="italic font-light opacity-60">{t(locale, "depths")}</span>
                    </h1>
                </MotionWrapper>
            </section>

            {/* 2. Topic Grid (Using existing component) */}
            <TopicExplore categories={categories} locale={locale} />

            {/* 3. Featured Collection Section */}
            <section className="py-24 px-6 md:px-12 bg-bg-secondary border-y border-border-subtle">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
                            <Image
                                src={Assets.imgPlaceholderImage7}
                                alt="Featured Collection"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-8">
                            <span className="text-xs font-bold tracking-widest uppercase text-accent">{t(locale, "curatedSeries")}</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-medium text-text-primary leading-tight">
                                {featured.titleTop} <br />
                                <span className="italic">{featured.titleBottom}</span>
                            </h2>
                            <p className="text-lg text-text-secondary max-w-md">
                                {featured.body}
                            </p>
                            <Link href="/article/ai-ethics" className="inline-block px-8 py-4 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">
                                {t(locale, "startReading")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Subscription Section */}
            <Subscription />
        </main>
    );
}
