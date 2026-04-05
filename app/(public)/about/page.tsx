"use client";

import { MotionWrapper } from "@/components/ui/MotionWrapper";
import Image from "next/image";
import { Assets } from "@/lib/assets";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function AboutPage() {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            badge: "আমাদের সম্পর্কে",
            title: "What if learning felt like listening to a great story around a campfire?",
            body1:
                "Wisdomia covers the full spectrum of human curiosity. History that feels alive — not like a textbook, but like a tale told by someone who was there. True crime that reads like a thriller. Politics stripped of the noise, explained the way it actually works. Psychology that holds a mirror up to the strangest subject of all: the human mind. Mystery that keeps you guessing long after you've finished reading.",
            body2:
                "If it's fascinating, if it's worth knowing, if it makes you say \"How? Why? I never knew that!\" — it belongs here.",
            sectionTitle: "Read, Listen or Watch",
            sectionBody1:
                "People learn differently. Some love to read. Others prefer listening to stories during a commute. Some want to see them unfold.",
            sectionBody2:
                "That's why every piece on Wisdomia is crafted to be sensational across all mediums. Read articles at your own pace, hit play and listen to them narrated, or dive into video content that brings the story to life visually. The knowledge is the same — the experience is yours to choose.",
            heroAlt: "গল্পের মাধ্যমে শেখা",
            mediaAlt: "পড়া, শোনা ও দেখা",
        }
        : {
            badge: "About",
            title: "What if learning felt like listening to a great story around a campfire?",
            body1:
                "Wisdomia covers the full spectrum of human curiosity. History that feels alive — not like a textbook, but like a tale told by someone who was there. True crime that reads like a thriller. Politics stripped of the noise, explained the way it actually works. Psychology that holds a mirror up to the strangest subject of all: the human mind. Mystery that keeps you guessing long after you've finished reading.",
            body2:
                "If it's fascinating, if it's worth knowing, if it makes you say \"How? Why? I never knew that!\" — it belongs here.",
            sectionTitle: "Read, Listen or Watch",
            sectionBody1:
                "People learn differently. Some love to read. Others prefer listening to stories during a commute. Some want to see them unfold.",
            sectionBody2:
                "That's why every piece on Wisdomia is crafted to be sensational across all mediums. Read articles at your own pace, hit play and listen to them narrated, or dive into video content that brings the story to life visually. The knowledge is the same — the experience is yours to choose.",
            heroAlt: "Learning through immersive storytelling",
            mediaAlt: "Read, listen, or watch",
        };

    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-300">
            <section className="pt-28 pb-10 px-6 text-center">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-text-primary mb-6 block">{copy.badge}</span>
                    <h1 className="max-w-5xl mx-auto text-4xl md:text-6xl font-serif font-medium text-text-primary tracking-tight leading-tight">
                        {copy.title}
                    </h1>
                </MotionWrapper>
            </section>

            <section className="px-6 md:px-12 py-10 md:py-14">
                <div className="max-w-6xl mx-auto space-y-10">
                    <div className="relative w-full h-[320px] md:h-[460px] rounded-2xl overflow-hidden border border-border-subtle">
                        <Image
                            src={Assets.imgAboutOffice}
                            alt={copy.heroAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, 1200px"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6 text-text-secondary text-lg md:text-xl leading-relaxed">
                        <p>{copy.body1}</p>
                        <p className="text-text-primary font-medium">{copy.body2}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-text-primary">
                                {copy.sectionTitle}
                            </h2>
                            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                                {copy.sectionBody1}
                            </p>
                            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                                {copy.sectionBody2}
                            </p>
                        </div>

                        <div className="relative w-full h-[280px] md:h-[360px] rounded-2xl overflow-hidden border border-border-subtle">
                            <Image
                                src={Assets.imgPlaceholderImage4}
                                alt={copy.mediaAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, 560px"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/15" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
