"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Subscription() {
    return (
        <section className="w-full py-20 md:py-32 bg-accent text-white overflow-hidden relative">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-7xl font-serif font-medium mb-4 md:mb-6 tracking-tight text-white">
                    Stay <span className="italic opacity-70">Ahead</span>
                </h2>
                <p className="text-base md:text-lg opacity-90 mb-8 md:mb-12 font-sans font-light text-white/90">
                    Join 50,000+ readers receiving our weekly curation of timeless wisdom and modern insights.
                </p>

                {/* Mobile: Stacked Form */}
                <form className="md:hidden flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Type your email..."
                        className="w-full bg-white/10 border border-white/30 rounded-full px-6 py-4 text-base placeholder:text-white/60 text-white focus:outline-none focus:border-white transition-colors"
                    />
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-white text-accent font-bold text-sm uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 active:opacity-90"
                    >
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </form>

                {/* Desktop: Inline Form */}
                <form className="hidden md:block relative group">
                    <input
                        type="email"
                        placeholder="Type your email..."
                        className="w-full bg-transparent border-b-2 border-white/30 py-6 text-2xl font-serif placeholder:text-white/60 text-white focus:outline-none focus:border-white transition-colors"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
                    >
                        Subscribe
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </form>
                <div className="mt-6 text-xs opacity-60 uppercase tracking-widest text-white/60">
                    No spam. Unsubscribe anytime.
                </div>
            </div>
        </section>
    );
}
