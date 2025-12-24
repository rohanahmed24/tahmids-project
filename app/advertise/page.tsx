"use client";

import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Assets } from "@/lib/assets";
import Image from "next/image";
import { BarChart, Globe, Users } from "lucide-react";

export default function AdvertisePage() {
    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-300">
            {/* 1. Hero Section */}
            <section className="pt-28 pb-20 px-6 text-center border-b border-border-subtle">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-text-primary mb-6 block">Partnerships</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-text-primary tracking-tighter leading-tight mb-8">
                        Connect with <br />
                        <span className="italic font-light opacity-60">Visionaries</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary font-sans leading-relaxed">
                        Partner with Wisdomia to reach a curated audience of design leaders, cultural thinkers, and tech innovators.
                    </p>
                </MotionWrapper>
            </section>

            {/* 2. Visual Anchor */}
            <section className="px-6 md:px-12 -mt-12 mb-20">
                <MotionWrapper type="fade-in" delay={0.2}>
                    <div className="max-w-[1440px] mx-auto relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src={Assets.imgAdvertiseCollaboration}
                            alt="Strategic Collaboration"
                            fill
                            sizes="(max-width: 768px) 100vw, 80vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                </MotionWrapper>
            </section>

            {/* 3. Stats / Why Us */}
            <section className="py-20 px-6 md:px-12 bg-bg-card">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: Users, title: "Curated Audience", desc: "Reach 50k+ highly engaged readers passionate about quality and depth." },
                        { icon: Globe, title: "Global Reach", desc: "Our stories resonate across 12 countries, bridging culture and technology." },
                        { icon: BarChart, title: "High Engagement", desc: "Average read time of 8+ minutes. Our audience doesn't just scroll, they read." }
                    ].map((stat, idx) => (
                        <div key={idx} className="space-y-4 p-8 border border-border-subtle rounded-xl hover:bg-bg-primary transition-colors duration-300">
                            <div className="w-12 h-12 bg-bg-secondary rounded-full flex items-center justify-center text-accent">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-text-primary">{stat.title}</h3>
                            <p className="text-text-secondary">{stat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Contact / CTA */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-xl mx-auto space-y-8">
                    <h2 className="text-4xl font-serif font-medium text-text-primary">Ready to collaborate?</h2>
                    <p className="text-text-secondary">
                        We offer bespoke partnership packages including sponsored essays, newsletter features, and event co-hosting.
                    </p>
                    <a href="mailto:partnerships@wisdomia.com" className="inline-block px-8 py-4 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity rounded-full">
                        Request Media Kit
                    </a>
                </div>
            </section>
        </main>
    );
}
