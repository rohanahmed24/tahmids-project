"use client";

import { AuthorsGrid } from "@/components/AuthorsGrid";
import { Subscription } from "@/components/Subscription";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Users, PenTool, Globe } from "lucide-react";
import Image from "next/image";
import { Assets } from "@/lib/assets";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function AboutPage() {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            mission: "আমাদের লক্ষ্য",
            elevating: "উন্নত করা",
            conversation: "আলোচনাকে",
            body: "Wisdomia হলো গুরুত্বপূর্ণ গল্পের একটি ডিজিটাল ঠিকানা। শব্দের ভিড়ে আমরা বিশ্বাস করি স্পষ্টতাই সবচেয়ে বড় বিলাসিতা।",
            studioAlt: "আমাদের স্টুডিও",
        }
        : {
            mission: "Our Mission",
            elevating: "Elevating the",
            conversation: "Conversation",
            body: "Wisdomia is a digital sanctuary for stories that matter. We curate wisdom, design, and culture for the modern thinker, believing that in an age of noise, clarity is the ultimate luxury.",
            studioAlt: "Our Studio",
        };
    const values = locale === "bn"
        ? [
            { icon: PenTool, title: "কারিগরি মান", desc: "সুন্দর লেখা ও নিখুঁত নকশার শক্তিতে আমরা বিশ্বাস করি।" },
            { icon: Users, title: "কমিউনিটি", desc: "চিন্তাশীল পাঠক ও সৃষ্টিশীল মানুষের একটি বৃত্ত গড়ে তোলা।" },
            { icon: Globe, title: "দৃষ্টিভঙ্গি", desc: "বৈচিত্র্যময় মত, যা ধারণাকে চ্যালেঞ্জ করে ও দিগন্ত প্রসারিত করে।" }
        ]
        : [
            { icon: PenTool, title: "Craftsmanship", desc: "We believe in the power of well-crafted words and meticulous design." },
            { icon: Users, title: "Community", desc: "Building a circle of thoughtful readers and visionary creators." },
            { icon: Globe, title: "Perspective", desc: "Diverse viewpoints that challenge assumptions and broaden horizons." }
        ];

    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-300">
            {/* 1. Hero Section */}
            <section className="pt-28 pb-20 px-6 text-center border-b border-border-subtle">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-text-primary mb-6 block">{copy.mission}</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-text-primary tracking-tighter leading-tight mb-8">
                        {copy.elevating} <br />
                        <span className="italic font-light opacity-60">{copy.conversation}</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary font-sans leading-relaxed mb-16">
                        {copy.body}
                    </p>
                    <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
                        <Image src={Assets.imgAboutOffice} alt={copy.studioAlt} fill sizes="(max-width: 768px) 100vw, 80vw" className="object-cover" priority />
                    </div>
                </MotionWrapper>
            </section>

            {/* 2. Values Manifest Section */}
            <section className="py-24 px-6 md:px-12 bg-bg-card">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    {values.map((value, idx) => (
                        <div key={idx} className="text-center space-y-4 p-8 border border-border-subtle rounded-xl hover:bg-bg-primary transition-colors duration-300">
                            <div className="w-12 h-12 mx-auto bg-bg-secondary rounded-full flex items-center justify-center text-accent">
                                <value.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-text-primary">{value.title}</h3>
                            <p className="text-text-secondary">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Team Section (Reuse AuthorsGrid) */}
            <div className="py-12">
                <AuthorsGrid />
            </div>

            {/* 4. Subscription Section */}
            <Subscription />
        </main>
    );
}
