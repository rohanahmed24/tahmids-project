"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";

export function DailyQuote() {
    const { locale } = useLocale();
    return (
        <section className="relative py-12 md:py-48 bg-bg-primary overflow-hidden border-y border-border-subtle">
            {/* Texture/Grain Overlay */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
                style={{ backgroundImage: "url('https://transparenttextures.com/patterns/concrete-wall.png')" }}>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span className="block text-xs font-bold tracking-[0.3em] uppercase opacity-50 mb-8 text-text-primary">
                        {locale === "bn" ? "দৈনিক অনুপ্রেরণা" : "Daily Inspiration"}
                    </span>

                    <blockquote className="text-xl md:text-3xl font-serif leading-relaxed text-center max-w-4xl mx-auto">
                        &quot;The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.&quot;
                    </blockquote>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-text-primary opacity-30"></div>
                        <span className="font-serif italic text-xl text-text-secondary">Coco Chanel</span>
                        <div className="h-[1px] w-12 bg-text-primary opacity-30"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
