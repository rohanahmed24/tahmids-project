"use client";

import { MotionWrapper } from "@/components/ui/MotionWrapper";
import Image from "next/image";
import { Assets } from "@/lib/assets";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function ContactPage() {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            badge: "যোগাযোগ",
            title: "যোগাযোগ করুন",
            imageAlt: "চিঠিপত্রের শিল্প",
            line1: "কোনো লেখা পাঠাতে চান, কিংবা অন্য কোনো প্রশ্ন আছে?",
            line2: "নির্দ্বিধায় আমাদের সাথে যোগাযোগ করতে পারেন।",
            writerLabel: "লেখকদের জন্য:",
            writerBody:
                "আমরা কেবল তথ্যবহুল লেখার বদলে বলার মতো গল্প চাই। আপনি লেখা পাঠাতে চাইলে চেষ্টা করবেন যেন আপনার লেখা প্রথম থেকে শেষ পর্যন্ত পাঠকদের ধরে রাখতে পারে। সকল তথ্যের জন্য ফুটনোট ব্যবহার করুন, যেন আমারা সহজেই নির্ভুলতা যাচাই করতে পারি।",
            emailLabel: "যে কোনো প্রশ্ন কিংবা লেখা পাঠাতে আমাদের ইমেইল করুন:",
            email: "contact@thewisdomia.com",
        }
        : {
            badge: "Contact",
            title: "Get in Touch",
            imageAlt: "The Art of Correspondence",
            line1: "Have a question or a story worth sharing? We would love to hear from you.",
            writerLabel: "For Contributors:",
            writerBody:
                "We look for narratives, not just articles. If you are submitting your work, ensure your piece is crafted to keep readers hooked from the first word to the end. Please include footnotes for all factual claims so that we can verify the information.",
            emailLabel: "For all queries and submissions, send us an email:",
            email: "contact@thewisdomia.com",
        };

    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-300">
            <section className="pt-28 pb-12 px-6 text-center">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.32em] uppercase opacity-40 text-text-primary mb-5 block">
                        {copy.badge}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-semibold text-text-primary tracking-tight leading-[0.95]">
                        {copy.title}
                    </h1>
                </MotionWrapper>
            </section>

            <section className="relative w-full h-[360px] md:h-[440px] overflow-hidden">
                <Image
                    src={Assets.imgContactStationery}
                    alt={copy.imageAlt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-bg-primary" />
            </section>

            <section className="relative -mt-20 md:-mt-24 pb-24 px-6 md:px-12">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <article className="lg:col-span-2 rounded-3xl border border-border-subtle bg-bg-secondary/95 backdrop-blur-sm p-6 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
                        <p className="text-lg md:text-2xl text-text-primary leading-relaxed">
                            {copy.line1}
                        </p>
                        {locale === "bn" && (
                            <p className="mt-4 text-lg md:text-xl text-text-primary leading-relaxed">
                                {copy.line2}
                            </p>
                        )}

                        <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-5 md:p-6">
                            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                                <span className="font-semibold text-text-primary">{copy.writerLabel} </span>
                                {copy.writerBody}
                            </p>
                        </div>
                    </article>

                    <aside className="rounded-3xl border border-border-subtle bg-bg-secondary p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] flex flex-col justify-center">
                        <p className="text-sm uppercase tracking-[0.2em] text-text-muted mb-4">
                            {copy.badge}
                        </p>
                        <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                            {copy.emailLabel}
                        </p>
                        <a
                            href={`mailto:${copy.email}`}
                            className="mt-5 inline-flex items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-lg md:text-xl font-semibold text-accent hover:bg-accent/15 transition-colors"
                        >
                            {copy.email}
                        </a>
                    </aside>
                </div>
                <div className="max-w-6xl mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
            </section>
        </main>
    );
}
